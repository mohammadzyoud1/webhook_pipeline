import { Request, Response } from "express";
import { getDeliveryAttemptsBYJobId } from "src/db/queries/deliveryAttempts";
import { createJob, getJobByID } from "src/db/queries/jobQueries";
import { getPipeLineBySourcePath } from "src/db/queries/pipeLineQueries";
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
    const job_id = req.params.job_id as string;
    try {
        const job = await getJobByID(job_id);
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        const attempts = await getDeliveryAttemptsBYJobId(job_id);
        return res.status(200).json({ job, delivery_attempts: attempts });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to get job" });
    }

}
