exports.SUCCESS_PAYMENT_CODE = "OTS_0000";
exports.FAILED_PAYMENT_CODE = "OTS_0001";
exports.SUCCESS_PAYMENT_MSG = "PAYMENT_SUCCESSFUL";
exports.FAILED_PAYMENT_MSG = "PAYMENT_FAILED";

exports.ONLINE_PAYMENT = "ONLINE";
exports.OFFLINE_PAYMENT = "OFFLINE";

exports.REGISTRATION_SMS_TYPE = "REGISTRATION";

// these are status codes from payment gateway
exports.PG_SUCCESS_PAYMENT_CODE_1 = "OTS0000";
exports.PG_SUCCESS_PAYMENT_CODE_2 = "OTS0002";

// cache variables names
const __processDb = process.env.DB_DATABASE;
exports.IMP_DATES_CACHE_KEY = `impDates_${__processDb}`;
exports.PROCESS_DETAILS_CACHE_KEY = `p_${__processDb}`;

// process dates enums
exports.PROCESS_DATES = Object.freeze({
	P_START_DATE: "p_start_date",
	P_REGISTRATION_END_DATE: "p_registration_end_date",
	P_EDIT_END_DATE: "p_edit_end_date",
	P_PAYMENT_END_DATE: "p_payment_end_date",
	P_PRINT_END_DATE: "p_print_end_date",
	P_HT_EXPIRY_DATE: "p_ht_expiry_date",
	P_PRACTICAL_HT_EXPIRY_DATE: "p_practical_ht_expiry_date",
	P_INTERVIEW_CALL_LETTER_EXPIRY_DATE: "p_interview_call_letter_expiry_date",
	P_ANSWER_KEY_EXPIRY_DATE: "p_answer_key_expiry_date",
});
