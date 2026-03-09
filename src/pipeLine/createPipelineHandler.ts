import { Request, Response } from "express";
import { createPipeline } from "../db/queries/pipeLineQueries.js";


export async function createPipelineHandler(req: Request, res: Response) {
    const { name, source_path, actionType } = req.body;
    if (!name || !source_path || !actionType) {
        return res.status(400).json({
            error: "Missing required fields: name, source_path, and actionType are all required."
        });
    }
    try {

        const result = await createPipeline(name, source_path, actionType);
        return res.status(200).json(result);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to create pipeline" });
    }
}