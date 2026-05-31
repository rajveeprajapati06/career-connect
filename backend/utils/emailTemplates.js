const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CareerConnect</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f3f4f6;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .header p {
      color: #e0e7ff;
      margin: 10px 0 0 0;
      font-size: 16px;
    }
    .content {
      padding: 40px 30px;
      color: #374151;
      line-height: 1.6;
    }
    .content h2 {
      color: #111827;
      font-size: 22px;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .btn {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 30px;
      border-radius: 8px;
      font-weight: 600;
      display: inline-block;
      box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px 20px;
      text-align: center;
      border-top: 1px solid #f3f4f6;
      color: #9ca3af;
      font-size: 14px;
    }
    .footer a {
      color: #4f46e5;
      text-decoration: none;
    }
    .detail-card {
      background-color: #f9fafb;
      border: 1px solid #f3f4f6;
      border-radius: 12px;
      padding: 20px;
      margin: 25px 0;
    }
    .detail-row {
      margin-bottom: 10px;
      font-size: 15px;
    }
    .detail-row:last-child {
      margin-bottom: 0;
    }
    .detail-label {
      font-weight: 600;
      color: #4b5563;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>CareerConnect</h1>
        <p>Your Portal to Career Success</p>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} CareerConnect. All rights reserved.</p>
        <p>123 Tech Avenue, Suite 500, San Francisco, CA 94107</p>
        <p>If you have any questions, feel free to <a href="mailto:support@careerconnect.com">email us</a>.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

const welcomeEmail = (name) => {
  return baseTemplate(`
    <h2>Welcome to CareerConnect, ${name}!</h2>
    <p>We are absolutely thrilled to have you join our community. Whether you are searching for your next dream job or looking to hire top-tier talent, CareerConnect has the tools and network to help you succeed.</p>
    <p>To get started, we recommend completing your profile so you can present your best self to prospective employers or candidates.</p>
    <div class="button-container">
      <a href="${process.env.CLIENT_URL || 'https://career-connect-y0mi.onrender.com'}/login" class="btn">Explore Dashboard</a>
    </div>
    <p>Happy connecting!<br>The CareerConnect Team</p>
  `);
};

const applicationSubmittedEmail = (candidateName, jobTitle, companyName) => {
  return baseTemplate(`
    <h2>Application Received!</h2>
    <p>Hi ${candidateName},</p>
    <p>Your application for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been successfully submitted!</p>
    <p>The hiring team will review your credentials, resume, and cover letter. We will notify you via email as soon as there is an update on your application status.</p>
    <div class="detail-card">
      <div class="detail-row"><span class="detail-label">Role:</span> ${jobTitle}</div>
      <div class="detail-row"><span class="detail-label">Company:</span> ${companyName}</div>
      <div class="detail-row"><span class="detail-label">Status:</span> Pending Review</div>
    </div>
    <div class="button-container">
      <a href="${process.env.CLIENT_URL || 'https://career-connect-y0mi.onrender.com'}/dashboard/candidate" class="btn">Track Applications</a>
    </div>
    <p>Wishing you the best of luck,<br>The CareerConnect Team</p>
  `);
};

const applicationAcceptedEmail = (candidateName, jobTitle, companyName) => {
  return baseTemplate(`
    <h2>Congratulations! 🎉</h2>
    <p>Hi ${candidateName},</p>
    <p>We have exciting news! Your application for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been <strong>Accepted</strong>.</p>
    <p>The company's hiring representative will contact you directly via email or phone shortly to discuss the next steps in the onboarding or interview process.</p>
    <div class="detail-card" style="background-color: #ecfdf5; border-color: #a7f3d0;">
      <div class="detail-row"><span class="detail-label">Position:</span> ${jobTitle}</div>
      <div class="detail-row"><span class="detail-label">Employer:</span> ${companyName}</div>
      <div class="detail-row"><span class="detail-label">Status:</span> Application Accepted</div>
    </div>
    <p>Congratulations once again! We're excited for your new journey.</p>
    <p>Best regards,<br>The CareerConnect Team</p>
  `);
};

const applicationRejectedEmail = (candidateName, jobTitle, companyName) => {
  return baseTemplate(`
    <h2>Update on your Application</h2>
    <p>Hi ${candidateName},</p>
    <p>Thank you for your interest in the <strong>${jobTitle}</strong> role at <strong>${companyName}</strong> and for taking the time to apply.</p>
    <p>After careful review of all applications, the hiring team has decided to move forward with other candidates whose qualifications closely align with their current needs.</p>
    <p>Please do not be discouraged! New job openings are posted on CareerConnect daily. We encourage you to keep exploring new opportunities.</p>
    <div class="button-container">
      <a href="${process.env.CLIENT_URL || 'https://career-connect-y0mi.onrender.com'}/jobs" class="btn">Search More Jobs</a>
    </div>
    <p>We wish you the very best in your professional endeavors.</p>
    <p>Warmly,<br>The CareerConnect Team</p>
  `);
};

const jobPostedEmail = (employerName, jobTitle) => {
  return baseTemplate(`
    <h2>Your Job Has Been Posted! 🚀</h2>
    <p>Hi ${employerName},</p>
    <p>This is to confirm that your job listing for <strong>${jobTitle}</strong> has been successfully published and is now active on CareerConnect.</p>
    <p>Candidates can now discover and apply for this position. You will receive notifications when new candidates apply, and you can review all applications from your employer dashboard.</p>
    <div class="button-container">
      <a href="${process.env.CLIENT_URL || 'https://career-connect-y0mi.onrender.com'}/dashboard/employer" class="btn">View Employer Dashboard</a>
    </div>
    <p>Thank you for choosing CareerConnect to build your team!</p>
    <p>Best regards,<br>The CareerConnect Team</p>
  `);
};

const passwordResetEmail = (name, resetUrl) => {
  return baseTemplate(`
    <h2>Reset Your Password</h2>
    <p>Hi ${name},</p>
    <p>You are receiving this email because you (or someone else) requested a password reset for your CareerConnect account.</p>
    <p>Please click the button below to choose a new password. This link is valid for 1 hour.</p>
    <div class="button-container">
      <a href="${resetUrl}" class="btn">Reset Password</a>
    </div>
    <p>If you did not make this request, you can safely ignore this email and your password will remain unchanged.</p>
    <p>Best regards,<br>The CareerConnect Team</p>
  `);
};

module.exports = {
  welcomeEmail,
  applicationSubmittedEmail,
  applicationAcceptedEmail,
  applicationRejectedEmail,
  jobPostedEmail,
  passwordResetEmail,
};
