const summaryRouter = require("express").Router();
const { middleware } = require("../middlewares/middleware.js");
const candidateCountSummaryController = require("../application/controllers/candidateCountSummaryController.js");

summaryRouter.get(
	"/get",
	middleware.checkForPoolConnection,
	candidateCountSummaryController._getAllSummary,
);

summaryRouter.get(
	"/v2/get",
	middleware.checkForPoolConnection,
	candidateCountSummaryController._getAllSummaryV2,
);

module.exports = summaryRouter;
