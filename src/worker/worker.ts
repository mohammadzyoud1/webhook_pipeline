import { d_base } from "../index.js";
import { pipelines, subscribers } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { createDeliveryAttempt } from "src/db/queries/deliveryAttempts.js";
import { getJobsByStatus, updateJob } from "src/db/queries/jobQueries.js";


function sentimentAnalysis(payload: any) {
    const message = payload.message?.toLowerCase() || "";

    const positiveWords = ["good", "great", "happy", "love", "excellent", "amazing", "wonderful", "best"];
    const negativeWords = ["bad", "hate", "sad", "angry", "terrible", "worst", "awful", "horrible"];

    const positiveCount = positiveWords.filter(w => message.includes(w)).length;
    const negativeCount = negativeWords.filter(w => message.includes(w)).length;

    let sentiment = "neutral";
    if (positiveCount > negativeCount) sentiment = "positive";
    if (negativeCount > positiveCount) sentiment = "negative";

    return { ...payload, sentiment };
}

function validateEmail(payload: any) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = emailRegex.test(payload.email || "");
    return { ...payload, email_valid: valid };
}

function currencyConverter(payload: any) {
    const rates: Record<string, number> = {
        EUR: 1.085,
        GBP: 1.27,
        JPY: 0.0067,
        JOD: 0.71,
        USD: 1
    };

    const { amount, from_currency, to_currency } = payload;

    if (!amount || !from_currency || !to_currency) {
        return { ...payload, error: "Missing amount, from_currency or to_currency" };
    }

    const inUSD = amount * rates[from_currency];
    const converted = inUSD / rates[to_currency];

    return { ...payload, converted_amount: parseFloat(converted.toFixed(2)), converted_currency: to_currency };
}

function runAction(action_type: string, payload: any): any {
    switch (action_type) {
        case "sentiment_analysis": return sentimentAnalysis(payload);
        case "validate_email": return validateEmail(payload);
        case "currency_converter": return currencyConverter(payload);
        default: throw new Error(`Invalid action type: ${action_type}`);
    }
}


async function deliverToSubscriber(url: string, result: any, job_id: string, subscriber_id: string) {
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(result)
            });

            console.log(`Delivered to ${url} on attempt ${attempt}`);
            // record success
            await createDeliveryAttempt(job_id, subscriber_id, true, 200, attempt);



            return;

        } catch (error) {
            console.error(`Attempt ${attempt} failed for ${url}`);

            // record failure
            await createDeliveryAttempt(job_id, subscriber_id, false, null, attempt);

            if (attempt < maxRetries) {
                // wait before retrying
                await new Promise(resolve => setTimeout(resolve, attempt * 2000));
            }
        }
    }

    console.error(`All ${maxRetries} attempts failed for ${url}`);
}


async function processJob(job: any) {
    try {
        const pipeline = await d_base.select().from(pipelines).where(eq(pipelines.id, job.pipeline_id));
        if (!pipeline || pipeline.length === 0) {
            throw new Error("Pipeline related to the job not found");
        }

        const result = runAction(pipeline[0].action_type, job.payload);

        const subs = await d_base.select().from(subscribers).where(eq(subscribers.pipeline_id, job.pipeline_id));

        for (const sub of subs) {
            await deliverToSubscriber(sub.url, result, job.id, sub.id);
        }
        await updateJob(job.id, "completed", result);

    }
    catch (error: any) {
        await updateJob(job.id, "failed", { error: error.message });
    }
}


async function startWorker() {
    console.log("Worker started...");
    while (true) {
        const queuedJobs = await getJobsByStatus("queued");


        for (const job of queuedJobs) {
            await updateJob(job.id, "processing");
            await processJob(job);
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

startWorker();