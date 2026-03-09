import { Request, Response } from "express";
import { deletePipeline } from "../db/queries/pipeLineQueries.js";
export async function deletePipelineHandler(req: Request, res: Response) {
    const name = req.params.name as string
    try {

        const result = await deletePipeline(name);
        if (!result || result.length === 0) {
            return res.status(404).json({ error: "Pipeline not found" });
        }
        return res.status(200).json({ message: `Pipeline ${name} deleted` });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to delete pipeline" });
    }
}