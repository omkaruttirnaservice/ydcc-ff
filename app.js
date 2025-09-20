require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const db_connect = require("./application/config/db.connect");
const morgan = require("morgan");
const errorHandler = require("./middlewares/errorMiddleware.js");
const { isDevEnv } = require("./application/config/_responderSet.js");
const { infoLog, errorLog } = require("./application/config/logger.js");

const {
	redisStore,
	connectRedis,
	redisClient,
} = require("./application/config/redisConnect.js");
const { initExpiryDateSchedule } = require("./middlewares/middleware.js");

const app = express();

app.use(cors());

app.use(
	session({
		store: redisStore,
		secret: "utirna_form_filling",
		resave: false,
		saveUninitialized: false,
	}),
);

app.use(
	db_connect.myConnection(db_connect.mysql, db_connect.dbOptions, "pool"),
);

app.set("views", path.join(__dirname, "application/views"));
app.set("view engine", "pug");
app.use(function (_, res, next) {
	res.set(
		"Cache-Control",
		"no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0",
	);
	next();
});

app.use(express.json({ limit: "1024mb" }));
app.use(express.urlencoded({ extended: true, limit: "1024mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const morganFormat = ":method :url :status :response-time ms";
app.use(
	morgan(morganFormat, {
		stream: {
			write: message => {
				const logObject = {
					method: message.split(" ")[0],
					url: message.split(" ")[1],
					status: message.split(" ")[2],
					responseTime: message.split(" ")[3],
				};
				infoLog(logObject);
			},
		},
	}),
);

redisClient.on("error", () => {
	errorLog("Error while connecting to Redis");
	process.exit(1);
});
redisClient.on("connect", () => {
	infoLog("Connected to Redis");
});

// cron schedules
require("./schdules/schedules.js");

// router
app.use(require("./routes/index.js"));

app.use((req, res, next) => {
	errorLog(`ROUTE_NOT_FOUND: ${req.path}`);
});

app.use(errorHandler);

(async () => {
	try {
		await connectRedis();
		// await connectRMQ();
		await startExpressServer();
		await initExpiryDateSchedule();
	} catch (error) {
		console.log(error);
	}
})();

async function startExpressServer() {
	const PORT = process.env.PORT || 9000;
	infoLog("Starting Express Server");
	app.listen(process.env.PORT, () => {
		infoLog(`Server started on ${PORT}`);
		infoLog(`http://localhost:${PORT}`);
		if (!isDevEnv()) {
			console.log(
				"\x1b[43m\x1b[37m INFO : Running production build \x1b[0m",
			);
		} else {
			console.log(`Server started on : http://localhost:${PORT}`);
		}
	});
}
