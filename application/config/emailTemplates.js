module.exports.paymentPending = (details = {}) => ({
	subject: "Regarding Payment For दि जालना पिपल्स को-ऑप. बँक लि., जालना",
	html: `<p>Dear candidate,<p><br>
        <p style="color:#1c7107;">With reference to our advertisement for the post of Trainee Clerk in Amravati Mandal, Loksatta & Lokmat newspapers on July 06, 2023 and your response to the same through application, you are hereby requested to kindly remit the requisite fee of Rs. 944/- through NEFT/RTGS/GPAY or Phone Pay at below mentioned payment details on or before July 20, 2023:</p><br>
        <p>Bank Account Name: <strong>The Maharashtra Urban Co-operative Banks Federation Ltd.</strong><br/>
        Bank Name: <strong>UCO Bank,  Wadala Branch,  Mumbai – 400031</strong><br/>
        Saving A/c No.: <strong>09780110032961</strong><br/>
        IFSC Code: <strong>UCBA0000978</strong></p>`,
});

module.exports.registrationDone = (details = {}) => ({
	subject: "दि जालना पिपल्स को-ऑप. बँक लि., जालना Recruitment Process",
	html: `<span>Hello, </span><br/>
          <span>Greetings of the day!</span>
          <p>Dear ${details.ub_first_name} ${details.ub_middle_name} ${details.ub_last_name},<p><br>
          <p style="color:#1c7107;">Your registration  for दि जालना पिपल्स को-ऑप. बँक लि., जालना recruitment is successful.</p><br>
          <p>
          Your login details are as<br/>
          Username::<strong>${details.r_id}</strong><br/>
          Password::<strong>${details.ub_password}</strong><br/>
          <strong><mark>Do not share the credentials.</mark></strong><br/></p>
          <p><i>Note: This is a system generated email.</i></p>
          <p>Thanks & Regards,<br/>
          HELP MUCBF TEAM<br/>
          CONTACT NO ::+91-782080844</p>`,
});

module.exports.candidateGuidelines = (details = {}) => ({
	subject: "दि जालना पिपल्स को-ऑप. बँक लि., जालना EXAMINATION GUIDELINES",
	html: `<span>Good Afternoon, </span><br/>
          <span>Greetings of the day!</span>
          <p>The following important guidelines related to examination are mentioned on the website:<p><br>
          <p style="color:#1c7107;"><b>1. Important Instructions For Candidates.</b></p><br>
          <p style="color:#1c7107;"><b>2. Valid Candidate List.</b></p><br>
          <p>Kindly visit the official website <a style="color:red" href="https://www.abhinandan.mucbf.in/" target="_bank">www.abhinandan.mucbf.in</a> for more details.
          <br/>
          HELP MUCBF TEAM<br/>
          CONTACT NO ::+91-782080844</p>`,
});

module.exports._forgotUsernameOtpTemplate = {
	subject: "YDCC-OTP",
	email: data => {
		return `
                        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                        <p>Dear ${data.first_name} ${data.middle_name} ${data.last_name},</p>

                        <p>We have received a request to recover your ${data.type} for 
                        <strong>YDCC Form Filling</strong>.</p>

                        <p><strong>Your One-Time Password (OTP):</strong></p>
                        <div style="font-size: 20px; font-weight: bold; color: #2c3e50; margin: 15px 0; letter-spacing: 4px;">
                                ${data.otp}
                        </div>

                        <p>This OTP is valid for <strong>10 minutes</strong>.
                        Please use it to verify your identity and recover your ${data.type} .</p>

                        <p>If you did not request this, please ignore this email or contact our support team at 
                        <a href="mailto:${data.from}">${data.from}</a>.</p>

                        <p>Best regards,<br>
                        <strong>${data.regards}</strong></p>
                        </div>`;
	},
};

module.exports._registrationEmailTemplate = {
	subject: "YDCC-Registration Successful",
	email: data => {
		return `
		<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
			<p>Dear ${data.first_name} ${data.middle_name} ${data.last_name},</p>

			<p>We are pleased to inform you that your registration for 
			<strong>APMC Amalner Form Filling</strong> has been successfully completed.</p>

			<p><strong>Your login credentials:</strong></p>
			<ul style="list-style-type: none; padding: 0;">
			<li>Username: <strong>${data.username}</strong></li>
			<li>Password: <strong>${data.password}</strong></li>
			</ul>

			<p>You can now log in and proceed with your application. 
			If you have any questions or need assistance, please contact our support team at 
			<a href="mailto:support@apmcamalner.com">support@apmcamalner.com</a>.</p>

			<p>Best regards,<br>
			<strong>APMC Amalner</strong></p>
		</div>`;
	},
};
