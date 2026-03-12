import { Request, response, Response } from "express";
import { getDeliveryAttemptsBYJobId } from "../db/queries/deliveryAttempts.js";
import { createJob, getJobByID } from "../db/queries/jobQueries.js";
import { getPipeLineBySourcePath } from "../db/queries/pipeLineQueries.js";
export async function webhookHandler(req: Request, res: Response) {
    const source_path = req.params.source_path as string;
    const payload = req.body;

    try {
        const pipeline = await getPipeLineBySourcePath(source_path);

        if (!pipeline || pipeline.length === 0) {
            return res.status(404).json({ error: "Pipeline not found" });
        }

        const job = await createJob(pipeline[0].id, payload);
        return res.status(202).json({ message: "Webhook received", job_id: job.id });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to process webhook" });
    }
}
export async function getJobByIDHandler(req: Request, res: Response) {
    const job_id = req.params.id as string;
    try {
        //    const job = await getJobByID(job_id);
        //    if (!job) {
        //        return res.status(404).json({ error: "Job not found" });
        //    }
        //    console.log("Attempts:\n");
        const attempts = await getDeliveryAttemptsBYJobId(job_id);

        return res.status(200).json({
            delivery_attempts: attempts.map((attempt: any) => ({
                job_id: attempt.job_id,
                subscriber_id: attempt.subscriber_id,
                success: attempt.success,
                response_status: attempt.response_status,
                attempt_number: attempt.attempt_number,
                attempt_time: attempt.attempt_time
            }))
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to get job" });
    }


}
