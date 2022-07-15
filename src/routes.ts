import { Application, Request, Response } from "express";

export default function routes(app: Application) {
	app.get("/", async (req: Request, res: Response) => res.sendStatus(200));
}
