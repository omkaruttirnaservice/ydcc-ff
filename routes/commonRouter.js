const router = require("express").Router();
const fileUpload = require("express-fileupload");
const indexController = require("../application/controllers/indexConroller.js");
const { middleware } = require("../middlewares/middleware.js");
const otpRouter = require("./otpRouter.js");

router.get(
	"/",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	indexController.getHomeView,
);

router.get(
	"/check-process-dates",
	middleware.checkForPoolConnection,
	indexController.checkProcessDates,
);

// ============================= USER ROUTES ==================================

// user navigation ====================================================
router.post(
	"/set-editor",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.setEditor,
);

// user registration ====================================================
router.get(
	"/new-registration",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.getNewRegistrationView,
);

router.post(
	"/registerd-new-user",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.addNewCandidate,
);

router.get(
	"/registrations-closed",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.registrationClosedView,
);

// this will send email to all registered students ====================================================
router.get(
	"/send-email-registered-students",
	middleware.checkForPoolConnection,
	indexController.sendEmailToRegisteredStudents,
);

// user home ====================================================
router.get(
	"/home",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.getCandidateHome,
);

router.get(
	"/call-letter",
	middleware.checkForPoolConnection,
	indexController.getInterviewCallLetter,
);

router.get(
	"/practical-exam-ht",
	middleware.checkForPoolConnection,
	indexController.getPracticalExamHt,
);

// eligibility criteria ====================================================
router.get(
	"/user-eligibility/:candidate_id",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.userEligibility,
);

router.post(
	"/save-eligible-details",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.saveEligibleDetails,
);

router.post(
	"/check-for-post-details",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.checkForPostDetails,
);

router.post(
	"/eligibility-dob",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.getDateOfBirthAge,
);

// user details =======================================================
router.get(
	"/user-details/:candidate_id",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.userDetails,
);

router.post(
	"/save-general-details",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.saveGeneralDetails,
);

// education details =======================================================
router.get(
	"/education-details/:candidate_id",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.educationDetailsView,
);

router.post(
	"/save-education-details",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.saveEducationDetails,
);

// experience details =======================================================
router.get(
	"/experience-details/:candidate_id",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.userExperienceView,
);

router.post(
	"/save-experience-details",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.saveExperienceDetails,
);

// achievement details =======================================================
router.get(
	"/achievement-details/:candidate_id",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.userAchievementView,
);

router.post(
	"/save-achievement-details",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.saveAchievementDetails,
);

// document upload =======================================================
router.get(
	"/document-upload/:candidate_id",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.documentUploadView,
);

router.post(
	"/save-uplaod-document",
	fileUpload(),
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.saveUploadDocuemnt,
);

router.post(
	"/save-s3-document-name",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.savesS3DoumentName,
);

router.post(
	"/delete-s3-document-name",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.delteS3DoumentName,
);

router.post(
	"/update-document-details-done",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.updateDocumentDetailsDone,
);

// extra document upload (not used) =======================================================
router.post(
	"/save-upload-extra-document",
	indexController.saveExtraUploadDocuemnt,
);

router.post(
	"/finalized-upload-extra-document",

	middleware.setProcessData,
	middleware.redirectToHome,
	middleware.checkForPoolConnection,
	indexController.finalizedExtraUploadDocuemnt,
);

router.get(
	"/extra-documents/:candidate_id",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.getExtraUploadDocumentView,
);

// application preview =======================================================
router.get(
	"/application-preview/:candidate_id",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.applicationPreview,
);

router.post(
	"/sumbit-preveiw",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.savePreview,
);

// application print =======================================================
router.get(
	"/application",
	middleware.checkForPoolConnection,
	middleware.setProcessData,
	middleware.redirectToHome,
	indexController.getApplicationView,
);

// auth =======================================================

router.post(
	"/login",
	middleware.checkForPoolConnection,
	indexController.makeUserLogedIn,
);

router.get(
	"/logout",
	middleware.checkForPoolConnection,
	indexController.getUserLogout,
);

router.get(
	"/forget",
	middleware.checkForPoolConnection,
	indexController.forgetCredentialsView,
);

// router.get(
// 	"/forget-password",
// 	middleware.checkForPoolConnection,
// 	indexController.forgetPasswordView,
// );

router.post(
	"/getPasswordRecovery",
	middleware.checkForPoolConnection,
	indexController.getPasswordRecovery,
);

router.get(
	"/forget-username",
	middleware.checkForPoolConnection,
	indexController.forgetUsernameView,
);

router.post(
	"/getUsernameRecovery",
	middleware.checkForPoolConnection,
	indexController.getUsernameRecovery,
);

router.post(
	"/v2/getUsernameRecovery",
	middleware.checkForPoolConnection,
	indexController.getUsernameRecovery_V2,
);

// OTP ROUTER
router.use(otpRouter);

// Razor pay pament / challan payments (unused) =======================================================
router.post(
	"/api/payment/order",
	middleware.checkForPoolConnection,
	middleware.redirectToHome,
	indexController.getPlacePaymentOrder,
);
router.get(
	"/verify-details/:r/:f",
	middleware.checkForPoolConnection,
	middleware.redirectToHome,
	indexController.getVerifyDetails,
);
router.get(
	"/payment-checksum/:token",
	middleware.checkForPoolConnection,
	middleware.redirectToHome,
	indexController.paymentChecksum,
);

router.get(
	"/payment-status/:r/:f",
	middleware.checkForPoolConnection,
	middleware.redirectToHome,
	indexController.checkPaymentStatus,
);
router.post(
	"/api/payment/verify",
	middleware.checkForPoolConnection,
	middleware.redirectToHome,
	indexController.getPlacePaymentOrderVerify,
);

router.post(
	"/api/save-payment-callan-details",
	middleware.checkForPoolConnection,
	middleware.redirectToHome,
	indexController.savePaymentCallanDetail,
);

// hallticket =========================================================
router.get(
	"/print-ht",
	middleware.checkForPoolConnection,
	// commenMiddleware.redirectToHome,
	indexController.printHallTicket,
);

router.get(
	"/preview-ht",
	middleware.checkForPoolConnection,
	// middleware.redirectToHome,
	indexController.previewHallTicket,
);

// save header files ==================================================
router.post(
	"/save-header-file",
	middleware.checkForPoolConnection,
	fileUpload(),
	indexController.saveHeaderFile,
);

// website leagal pages ================================================

// router.get(
// 	"/about-us",
// 	middleware.checkForPoolConnection,
// 	indexController.getAboutUs,
// );

// router.get(
// 	"/contact-us",
// 	middleware.checkForPoolConnection,
// 	indexController.getContactUs,
// );

// router.get(
// 	"/services",
// 	middleware.checkForPoolConnection,
// 	indexController.getServices,
// );

// router.get(
// 	"/service-policy",
// 	middleware.checkForPoolConnection,
// 	indexController.getServicePolicy,
// );

// router.get(
// 	"/refund-policy",
// 	middleware.checkForPoolConnection,
// 	indexController.getRefundPolicy,
// );

// =============================================================

router.get(
	"/test-sms",
	middleware.checkForPoolConnection,
	indexController.testSMS,
);

router.get(
	"/paper-key",
	middleware.checkForPoolConnection,
	middleware.redirectToHome,
	indexController.paperKeyView,
);

router.get(
	"/result",
	middleware.checkForPoolConnection,
	middleware.redirectToHome,
	indexController.paperResult,
);

router.get(
	"/result-print",
	middleware.checkForPoolConnection,
	middleware.redirectToHome,
	indexController.printResult,
);

router.get(
	"/how-to-apply",
	middleware.checkForPoolConnection,
	middleware.redirectToHome,
	indexController.getHowToApply,
);

router.get(
	"/if-challan-fail",
	middleware.checkForPoolConnection,
	middleware.redirectToHome,
	indexController.getHowToApplyTwo,
);

router.get(
	"/reg-instruction",
	middleware.checkForPoolConnection,
	indexController.getInstructionsView,
);

router.get(
	"/reg-instruction",
	middleware.checkForPoolConnection,
	middleware.redirectToHome,
	indexController.getInstructionsView,
);

router.get(
	"/get-count",
	middleware.checkForPoolConnection,
	indexController.getRegistrationCount,
);

router.get(
	"/at-list",
	middleware.checkForPoolConnection,
	middleware.redirectToHome,
	indexController.attendanceList,
);

router.post(
	"/getVerifyRecoveryDetails",
	middleware.checkForPoolConnection,
	indexController.getVerifyRecoveryDetails,
);

router.post(
	"/sendOTP",
	middleware.checkForPoolConnection,
	indexController.sendOTP,
);

module.exports = router;
