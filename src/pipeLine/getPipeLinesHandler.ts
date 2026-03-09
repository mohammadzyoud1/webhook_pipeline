import { Request, Response } from "express";
import { getPipeLines } from "../db/queries/pipeLineQueries.js";
export async function getPipeLinesHandler(req: Request, res: Response) {
    const name = req.params.name as string | undefined;
    try {

        const result = await getPipeLines(name);
        return res.status(200).json(result);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to get pipeline" });
    }
}