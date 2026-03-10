import { d_base } from "../../index.js";
import { delivery_attempts } from "../schema.js";
import { eq } from "drizzle-orm";
export async function createDeliveryAttempt(job_id: string, subscriber_id: string, success: boolean, response_status: any, attempt_time: number) {


    const result = await d_base.insert(delivery_attempts).values({
        job_id: job_id,
        subscriber_id: subscriber_id,
        success: success,
        response_status: response_status,
        attempt_time: attempt_time
    }).returning();

    return (result[0]);

}

export async function getDeliveryAttemptsBYJobId(job_id: string) {

    const result = await d_base.select().from(delivery_attempts).where(eq(delivery_attempts.job_id, job_id));
    return result[0];

}