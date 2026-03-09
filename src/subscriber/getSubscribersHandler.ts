import { Request, Response } from "express";
import { getSubscribers } from "../db/queries/subscriberQueries.js";
export async function getSubscribersHandler(req: Request, res: Response) {
    const name = req.params.name as string | undefined;
    try {

        const result = await getSubscribers(name);
        return res.status(200).json(result);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to get subscriber" });
    }
}