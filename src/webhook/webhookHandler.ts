import { Request, Response } from "express";
import { createJob } from "src/db/queries/jobQueries";
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