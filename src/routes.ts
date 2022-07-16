import { Application, Request, Response } from "express";

export default function routes(app: Application) {
	app.get("/", async (req: Request, res: Response) => {
		try {
			res.json({ message: "OK" });
		} catch (error) {
			res.json({ error: { status: 500, message: "Internal server error" } });
		}
	});
}
