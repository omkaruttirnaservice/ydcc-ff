const indexRouter = require("express").Router();
const commonRouter = require("./commonRouter.js");
const paymentRouter = require("./paymentRouter.js");
const awsRouter = require("./awsRouter.js");
const apiRouter = require("./apiRouter.js");
const summaryRouter = require("./summaryRouter.js");
const dbBackupRouter = require("./dbBackupRouter.js");
const policiesRouter = require("./policiesRouter.js");
const {
	sendRegistrationEmailZeptomail,
	sendForgetOtpZeptomail,
	sendExamIcal,
} = require("../application/controllers/emailController.js");

const { default: ical } = require("ical-generator");

console.log(process.pid, "-process id");

indexRouter.get("/m", (req, res, next) => {
	let emailData = {
		email: "omkarpatole1799@gmail.com",
		first_name: "omakr",
		middle_name: "popat",
		last_name: "patole",
		username: 1010001,
		password: 574643,
	};
	sendRegistrationEmailZeptomail(emailData);
});

indexRouter.get("/cal", (req, res, next) => {
	console.log(ical, "ical,=======");

	const cal = ical();

	cal.createEvent({
		start: new Date(),
		end: new Date(),
		summary: "Jr. Clerk Exam",
		description: "Download Hallticket Here: https://ydccbank.com/ht",
		location: "Exam Center 2",
		url: "https://ydccbank.com",
	});

	console.log(cal, "=cal");

	const icalString = cal.toString();
	console.log(icalString);
	const icalBase64 = Buffer.from(icalString, "utf8").toString("base64");

	let emailData = {
		from: "help@ydccbank.com",
		// email: "omkaruttirnaservice@gmail.com",
		// email: "deepakkumarshinde0@gmail.com",
		email: "uttirnaservices9@gmail.com",
		first_name: "omakr",
		middle_name: "popat",
		last_name: "patole",
		otp: 123456,
		type: "username",
		regards: "YDCC Bank",
		icalBase64: icalBase64,
	};
	sendExamIcal(emailData);
});

indexRouter.get("/otp", (req, res, next) => {
	let emailData = {
		from: "help@ydccbank.com",
		email: "omkaruttirnaservice@gmail.com",
		first_name: "omakr",
		middle_name: "popat",
		last_name: "patole",
		otp: 123456,
		type: "username",
		regards: "YDCC Bank",
	};
	sendForgetOtpZeptomail(emailData);
});

indexRouter.use(commonRouter);
indexRouter.use(paymentRouter);
indexRouter.use(policiesRouter);
indexRouter.use("/aws", awsRouter);
indexRouter.use("/api", apiRouter);
indexRouter.use("/summary", summaryRouter);
indexRouter.use("/db-backup", dbBackupRouter);

module.exports = indexRouter;
