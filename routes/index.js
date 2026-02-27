const fs = require("fs");
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
	sendHallticketLiveNotificationEmailZeptomail,
	sendExamPostPondEmailZeptomail,
	sendExamPostPondEmailZeptomailV2,
} = require("../application/controllers/emailController.js");
const runQuery = require("../application/config/runQuery.js");
const { middleware } = require("../middlewares/middleware.js");

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

indexRouter.get(
	"/hallticket-live-notification",
	middleware.checkForPoolConnection,
	async (req, res, next) => {
		// const q =
		// 	"SELECT ub.ub_first_name as first_name, ub_middle_name as middle_name, ub_last_name AS last_name, ub.ub_email_id as email FROM utr_candidate_appications_final AS ucaf inner join utr_user_basic AS ub on ucaf.ca_reg_id = ub.id";

		const q = `SELECT 
					ub.ub_first_name as first_name, 
					ub_middle_name as middle_name, 
					ub_last_name AS last_name, 
					ub.ub_email_id as email 
				FROM 
					utr_candidate_appications_final AS ucaf 
				inner join utr_user_basic AS ub 
				on ucaf.ca_reg_id = ub.id

				WHERE ucaf.ca_ht_download = 0
				`;
		const candidates = await runQuery(res.pool, q);
		// console.log(candidates, "-candidates");

		// candidates.forEach(candidate => {
		// 	let emailData = {
		// 		email: candidate.email,
		// 		first_name: candidate.first_name,
		// 		middle_name: candidate.middle_name,
		// 		last_name: candidate.last_name,
		// 	};
		// 	sendHallticketLiveNotificationEmailZeptomail(emailData);
		// });

		let emailData = {
			email: "omkaruttirnaservice@gmail.com",
			first_name: "omakr",
			middle_name: "popat",
			last_name: "patole",
		};
		sendHallticketLiveNotificationEmailZeptomail(emailData);
	},
);

indexRouter.get(
	"/exam-postponement-notification",
	middleware.checkForPoolConnection,
	async (req, res, next) => {
		const q = `SELECT 
					ub.ub_first_name as first_name, 
					ub_middle_name as middle_name, 
					ub_last_name AS last_name, 
					ub.ub_email_id as email 
				FROM 
					utr_candidate_appications_final AS ucaf 
				inner join utr_user_basic AS ub
				on ucaf.ca_reg_id = ub.id 
				LIMIT  1000
				OFFSET 6000`;

		const candidates = await runQuery(res.pool, q);
		console.log(candidates.length, "-candidates");

		let emailCount = 0;

		candidates.forEach((candidate, idx) => {
			emailCount++;
			let emailData = {
				email: candidate.email,
				first_name: candidate.first_name,
				middle_name: candidate.middle_name,
				last_name: candidate.last_name,
			};
			sendExamPostPondEmailZeptomail(emailData);
			console.log("Sending email to ", idx);
		});

		console.log("Total email sent: ", emailCount);
	},
);

indexRouter.get(
	"/v2/exam-postponement-notification",
	middleware.checkForPoolConnection,
	async (req, res, next) => {
		const q = `SELECT 
					ub.ub_first_name as first_name, 
					ub.ub_middle_name as middle_name, 
					ub.ub_last_name AS last_name, 
					ub.ub_email_id as email 
				FROM 
					utr_candidate_appications_final AS ucaf 
				inner join utr_user_basic AS ub
				on ucaf.ca_reg_id = ub.id 
				LIMIT 10`;

		const candidates = await runQuery(res.pool, q);

		let batchSize = 200;

		let totalBatches = Math.ceil(candidates.length / batchSize);

		for (let batch = 0; batch < totalBatches; batch++) {
			let batchCandidates = candidates.slice(
				batch * batchSize,
				(batch + 1) * batchSize,
			);
			let rejectedPromises = new Map();
			let promisesResults = await Promise.allSettled(
				batchCandidates.map(candidate => {
					let emailData = {
						email: candidate.email,
						first_name: candidate.first_name,
						middle_name: candidate.middle_name,
						last_name: candidate.last_name,
					};
					return sendExamPostPondEmailZeptomailV2(emailData);
				}),
			);

			promisesResults.forEach(promise => {
				if (promise.status === "rejected") {
					const email =
						promise.reason?.data?.email || "Unknown Email";
					const errorReason =
						promise.reason?.reason || promise.reason.toString();
					fs.appendFileSync(
						"rejected-email-logs.log",
						email + "||" + errorReason + "\n",
					);
				}
			});
		}

		return res.send("Done sending email...");
	},
);

indexRouter.use(commonRouter);
indexRouter.use(paymentRouter);
indexRouter.use(policiesRouter);
indexRouter.use("/aws", awsRouter);
indexRouter.use("/api", apiRouter);
indexRouter.use("/summary", summaryRouter);
indexRouter.use("/db-backup", dbBackupRouter);

module.exports = indexRouter;
