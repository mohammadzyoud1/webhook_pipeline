import { d_base } from "../../index.js";
import { jobs } from "../schema.js";
import { eq } from "drizzle-orm"
export async function createJob(pipeline_id: string, payload: object) {
    const result = await d_base.insert(jobs).values({
        pipeline_id: pipeline_id,
        payload: payload,
        status: "queued"
    }).returning();
    return result[0];
}

export async function getJobByID(job_id: string) {
    const result = await d_base.select().from(jobs).where(eq(jobs.id, job_id));
    return result;
}

export async function getJobsByStatus(status: string) {
    const result = await d_base.select().from(jobs).where(eq(jobs.status, status));
    return result;
}

export async function updateJob(job_id: string, status: string, result?: any) {
    await d_base.update(jobs).set({ status: status, ...(result !== undefined && { result }) }).where(eq(jobs.id, job_id));

}

