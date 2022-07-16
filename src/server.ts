import express, { Application } from "express";
import config from "config";
import morgan from "morgan";
import routes from "./routes";

// express configs
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

// server
const PORT = config.get("port") as number;

app.listen(PORT, () => {
	console.log(`https://localhost:${PORT}`);
	routes(app);
});
