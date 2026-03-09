import { Request, Response } from "express";
import { createSubscriber } from "../db/queries/subscriberQueries.js";
import { getPipeLines } from "src/db/queries/pipeLineQueries";
export async function createSubscriberHandler(req: Request, res: Response) {
    const { name, pipeLineName, url } = req.body;
    if (!name || !pipeLineName || !url) {
        return res.status(400).json({
            error: "Missing required fields: name, pipeLineName, and url are all required."
        });
    }

    const pipelineID = await getPipeLines(pipeLineName);
    if (!pipelineID || pipelineID.length === 0) {
        throw new Error("Pipeline not found");
    }
    try {

        const result = await createSubscriber(name, pipelineID[0].id, url);
        return res.status(200).json(result);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to create subscriber" });
    }
}