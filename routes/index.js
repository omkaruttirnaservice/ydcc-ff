const indexRouter = require("express").Router();
const commonRouter = require("./commonRouter.js");
const paymentRouter = require("./paymentRouter.js");
const awsRouter = require("./awsRouter.js");
const apiRouter = require("./apiRouter.js");
const summaryRouter = require("./summaryRouter.js");
const dbBackupRouter = require("./dbBackupRouter.js");
const policiesRouter = require('./policiesRouter.js')

console.log(process.pid, "-process id");

indexRouter.use(commonRouter);
indexRouter.use(paymentRouter);
indexRouter.use(policiesRouter)
indexRouter.use("/aws", awsRouter);
indexRouter.use("/api", apiRouter);
indexRouter.use("/summary", summaryRouter);
indexRouter.use("/db-backup", dbBackupRouter);

module.exports = indexRouter;
