const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();
const sendEmailReminder = async(toEmail, jobTitle, applyByDate, companyName)=>{
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  const sendSmtpEmail ={
    to:[{email: toEmail}],
    sender:{name:"Job Tracker", email:"vaidehidhole312@gmail.com"},
    subject: `Reminder: Apply for "${jobTitle}" before ${applyByDate}`,
    htmlContent: `
      <h3>Hey there!</h3>
      <p>This is a reminder to apply for the job: <strong>${jobTitle}</strong> for company  <strong>${companyName}</strong>.</p>
      <p>The last date to apply is <strong>${applyByDate}</strong>.</p>
      <p>Good luck!</p>
    `
  };
  try{
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`Reminder sent to ${toEmail}`)
  }
  catch (error) {
    console.error('Error sending email:', error);
  }
}
module.exports = sendEmailReminder;