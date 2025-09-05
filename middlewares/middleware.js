const schedule = require("node-schedule");
const { io } = require("socket.io-client");
const {
	getFromGlobalCache,
	setToGlobalCache,
	compareTime,
	isDateExpired,
} = require("../application/config/_responderSet.js");
const IndexModel = require("../application/model/indexModel.js");
const {
	IMP_DATES_CACHE_KEY,
	PROCESS_DETAILS_CACHE_KEY,
	PROCESS_DATES,
} = require("../application/config/constants.js");
const { _pool } = require("../application/config/db.connect-pool.js");

const middleware = {
	redirectToHome: async function (req, res, next) {
		const _impDates = await getFromGlobalCache(IMP_DATES_CACHE_KEY);

		const originalUrl = req.originalUrl.split("?")[0];
		switch (originalUrl) {
			case "/new-registration":
				if (
					isDateExpired(
						_impDates,
						PROCESS_DATES.P_REGISTRATION_END_DATE,
					)
				) {
					return res.redirect("/registrations-closed");
				}
				break;

			case "/payment-page":
				if (
					isDateExpired(_impDates, PROCESS_DATES.P_PAYMENT_END_DATE)
				) {
					return res.redirect("/");
				}
				break;
		}
		next();
	},

	setProcessData: async (req, res, next) => {
		// check if session has process data
		// if process data not availble in session get process data and set to session
		if (
			!(await getFromGlobalCache(PROCESS_DETAILS_CACHE_KEY)) ||
			!(await getFromGlobalCache(IMP_DATES_CACHE_KEY))
		) {
			let _processData = await IndexModel.getProcessData(res.pool);
			await setToGlobalCache(
				PROCESS_DETAILS_CACHE_KEY,
				_processData[0],
				6000,
			);

			await initExpiryDateSchedule();
		}

		next();
	},

	checkForPoolConnection: (req, res, next) => {
		req.getConnection(function (err, connection) {
			if (err) {
				next(err);
			} else {
				res.pool = connection;
				next();
			}
		});
	},

	checkForPoolConnectionWithSession: (req, res, next) => {
		console.log(process.pid, "-process_id");
		middleware.setSessionData(req);
		console.log(req.session, "in middleware");
		if (typeof req.session.User == "undefined") return res.redirect("/");

		req.getConnection(function (err, connection) {
			if (err) {
				next(err);
			} else {
				res.pool = connection;
				next();
			}
		});
	},
	setSessionData: req => {
		// req.session.cri = 101201;
		// req.session.criString = 'MTAxMjAx';
		// req.session.cfi = 0;
		// req.session.currentPassword = 'lw8yyh28';
		// req.session.cri = 17;
		// req.session.criString = 'MTc=';
		// req.session.fullName = 'O O O';
		// req.session.fatherName = 'O';
	},
};

async function initExpiryDateSchedule() {
	try {
		console.log("Setting up dates expiry time schedule");

		let cachedImpDates = await getFromGlobalCache(IMP_DATES_CACHE_KEY);

		// If cache empty, fetch from DB
		if (!cachedImpDates) {
			let _processData = await IndexModel.getProcessData(_pool);
			cachedImpDates = _processData[0].important_dates;
			await setToGlobalCache(IMP_DATES_CACHE_KEY, cachedImpDates);
		}

		for (const _date of cachedImpDates) {
			const expiryDateTime = new Date(_date.original_date_format);

			const alreadyExpired = compareTime(
				new Date(),
				_date.original_date_format,
			);
			if (alreadyExpired) {
				console.log(`Already expired: ${_date._column}`);
				await _updateExpiryStatusToCache(_date);
				continue;
			}

			console.log(
				`Scheduling expiry for ${_date._column} at ${expiryDateTime}`,
			);
			schedule.scheduleJob(expiryDateTime, async () => {
				console.log(`Triggering expiry update for ${_date._column}`);
				await _updateExpiryStatusToCache(_date);
			});
		}
	} catch (error) {
		console.error("Error in initExpiryDateSchedule:", error);
	}
}

async function _updateExpiryStatusToCache(_date) {
	let latestDates = await getFromGlobalCache(IMP_DATES_CACHE_KEY); // ✅ Always get latest version
	const updatedDates = latestDates.map(_d =>
		_d._column === _date._column ? { ..._d, isExpired: true } : _d,
	);
	await setToGlobalCache(IMP_DATES_CACHE_KEY, updatedDates);
}

module.exports = {
	middleware,
	initExpiryDateSchedule,
};
