const runQuery = require("../config/runQuery");

exports.otpModel = {
	addNewOtp: async (pool, data) => {
		return new Promise((resolve, reject) => {
			const q = `INSERT INTO utr_otp 
                    (otp,expiry, type,reference_id) 
                    VALUES (?,?,?,?)`;

			pool.query(
				q,
				[data.otp, data.expiry, data.otpType, data.reference_id],
				(error, results) => {
					if (error) {
						return reject(error);
					}
					return resolve(results);
				},
			);
		});
	},

	checkOtpValid: async (pool, otp, reference_id) => {
		const q = `SELECT * FROM utr_otp WHERE 
                        otp = ? 
                    AND reference_id = ? 
                    AND expiry > UNIX_TIMESTAMP() * 1000
                    AND is_expired = 'N' ORDER BY id DESC LIMIT 1`;

		return await runQuery(pool, q, [otp, reference_id]);
	},
};
