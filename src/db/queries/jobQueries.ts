import { d_base } from "../../index.js";
import { jobs } from "../schema";

export async function createJob(pipeline_id: string, payload: object) {
    const result = await d_base.insert(jobs).values({
        pipeline_id: pipeline_id,
        payload: payload,
        status: "queued"
    }).returning();
    return result[0];
}