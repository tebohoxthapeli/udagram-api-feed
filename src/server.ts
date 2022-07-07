import express from "express";
import cors, { CorsOptions } from "cors";

import { sequelize } from "./sequelize";
import { IndexRouter } from "./controllers/v0/index.router";
import { V0_FEED_MODELS } from "./controllers/v0/model.index";
import { config } from "./config/config";

(async () => {
	sequelize.addModels(V0_FEED_MODELS);

	console.debug("Initialize database connection...");
	await sequelize.sync();

	const app = express();
	const port = process.env.PORT || 8080;

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	// We set the CORS origin to * so that we don't need to
	// worry about the complexities of CORS this lesson. It's
	// something that will be covered in the next course.

	const corsOptions: CorsOptions = {
		origin: "*",
		credentials: true,
		optionsSuccessStatus: 200,
		allowedHeaders: [
			"Origin",
			"X-Requested-With",
			"Content-Type",
			"Accept",
			"Authorization",
			"X-Access-Token",
		],
		preflightContinue: true,
		methods: ["GET", "HEAD", "OPTIONS", "PUT", "PATCH", "POST", "DELETE"],
	};

	app.use(cors(corsOptions));

	// app.use(
	// 	cors({
	// 		allowedHeaders: [
	// 			"Origin",
	// 			"X-Requested-With",
	// 			"Content-Type",
	// 			"Accept",
	// 			"X-Access-Token",
	// 			"Authorization",
	// 		],
	// 		methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
	// 		preflightContinue: true,
	// 		origin: "*",
	// 	})
	// );

	app.use("/api/v0/", IndexRouter);

	// Root URI call
	app.get("/", async (req, res) => {
		res.send("/api/v0/");
	});

	// Start the Server
	app.listen(port, () => {
		console.log(`server running ${config.url}`);
		console.log(`press CTRL+C to stop server`);
	});
})();
