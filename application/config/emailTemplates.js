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
	subject: "YDCC - OTP Verification",
	email: data => {
		return `
        <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f8f9fa; padding: 20px; color: #333;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                        
                        <!-- Header -->
                        <h2 style="color: #4E6688; margin-top: 0; text-align: center;">OTP Verification 🔐</h2>
                        
                        <!-- Greeting -->
                        <p style="font-size: 15px;">Dear <strong>${data.first_name} ${data.middle_name || ""} ${data.last_name}</strong>,</p>
                        
                        <!-- Body -->
                        <p style="font-size: 15px; line-height: 1.6;">
                        We have received a request to recover your <strong>${data.type}</strong> for 
                        <strong>YDCC Form Filling</strong>.
                        </p>
                        
                        <!-- OTP Block -->
                        <div style="background: #f1f3f5; padding: 20px; border-radius: 6px; margin: 20px 0; text-align: center;">
                        <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 15px;">Your One-Time Password (OTP)</p>
                        <p style="font-size: 24px; font-weight: bold; color: #2c3e50; letter-spacing: 6px; margin: 10px 0;">
                        ${data.otp}
                        </p>
                        <p style="margin: 0; font-size: 14px; color: #555;">Valid for <strong>10 minutes</strong></p>
                        </div>
                        
                        <!-- Next steps -->
                        <p style="font-size: 15px; line-height: 1.6;">
                        Please use this OTP to verify your identity and recover your <strong>${data.type}</strong>.  
                        If you did not request this, kindly ignore the email or contact our support team at  
                        <a href="mailto:${data.from}" style="color: #007bff; text-decoration: none;">${data.from}</a>.
                        </p>
                        
                        <!-- Closing -->
                        <p style="margin-top: 30px; font-size: 15px;">
                        Best regards,<br>
                        <strong>${data.regards}</strong>
                        </p>
                        
                </div>
        </div>`;
	},
};

module.exports._registrationEmailTemplate = {
	subject: "YDCC - Registration Successful",
	email: data => {
		return `
                <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f8f9fa; padding: 20px; color: #333;">
                        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                                
                                <!-- Header -->
                                <h2 style="color: #4E6688; margin-top: 0; text-align: center;">Registration Successful 🎉</h2>
                                
                                <!-- Greeting -->
                                <p style="font-size: 15px;">Dear <strong>${data?.first_name} ${data?.middle_name || ""} ${data?.last_name}</strong>,</p>
                                
                                <!-- Body -->
                                <p style="font-size: 15px; line-height: 1.6;">
                                We are pleased to inform you that your registration for 
                                <strong>The Yavatmal District Central Co-Op. Bank Ltd., Yavatmal</strong> has been successfully completed.
                                </p>
                                
                                <!-- Credentials -->
                                <div style="background: #f1f3f5; padding: 15px; border-radius: 6px; margin: 20px 0;">
                                <p style="margin: 0 0 8px 0; font-weight: bold;">Your login credentials:</p>
                                <p style="margin: 4px 0;">Username: <strong>${data.username}</strong></p>
                                <p style="margin: 4px 0;">Password: <strong>${data.password}</strong></p>
                                </div>
                                
                                <!-- Next steps -->
                                <p style="font-size: 15px; line-height: 1.6;">
                                You can now log in and proceed with your application.
                                If you have any questions or need assistance, please reach out to our support team at 
                                <a href="mailto:help@ydccbank.com" style="color: #007bff; text-decoration: none;">help@ydccbank.com</a>.
                                </p>
                                
                                <!-- Closing -->
                                <p style="margin-top: 30px; font-size: 15px;">
                                Best regards,<br>
                                <strong>Team, YDCC</strong>
                                </p>
                                
                        </div>
                </div>`;
	},
};

module.exports._paymentSuccessTemplate = {
	subject: "YDCC - Payment Successful",
	email: data => {
                console.log(data, 'for template');
		return `
        <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f8f9fa; padding: 20px; color: #333;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                        
                        <!-- Header -->
                        <h2 style="color: #4E6688; margin-top: 0; text-align: center;">Payment Successful ✅</h2>
                        
                        <!-- Greeting -->
                        <p style="font-size: 15px;">Dear <strong>${data?.first_name} ${data?.middle_name || ""} ${data?.last_name}</strong>,</p>
                        
                        <!-- Body -->
                        <p style="font-size: 15px; line-height: 1.6;">
                        We are pleased to inform you that your payment has been successfully processed for the  
                        <strong>YDCC Form Filling</strong>.
                        </p>
                        
                        <!-- Payment Details -->
                        <div style="background: #f1f3f5; padding: 20px; border-radius: 6px; margin: 20px 0;">
                        <p style="margin: 0 0 12px 0; font-weight: bold; font-size: 15px;">Transaction Details:</p>
                        <p style="margin: 6px 0;"><strong>Payment Amount:</strong> ₹${data?.amount}</p>
                        <p style="margin: 6px 0;"><strong>Post Name:</strong> ${data?.post_name}</p>
                        <p style="margin: 6px 0;"><strong>User ID:</strong> ${data?.r_id}</p>
                        <p style="margin: 6px 0;"><strong>Application No:</strong> ${data?.f_id}</p>
                        <p style="margin: 6px 0;"><strong>Payment Date:</strong> ${data?.payment_date} (${data?.payment_time})</p>
                        <p style="margin: 6px 0;"><strong>Transaction ID:</strong> ${data?.transaction_id}</p>
                        </div>
                        
                        <!-- Next Steps -->
                        <p style="font-size: 15px; line-height: 1.6;">
                        Please log in to your account to download the application form.
                        </p>
                        
                        <!-- Closing -->
                        <p style="margin-top: 30px; font-size: 15px;">
                        Best regards,<br>
                        <strong>YDCC Team</strong>
                        </p>
                        
                </div>
        </div>`;
	},
};
