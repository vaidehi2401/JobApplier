const cron = require('node-cron');
const moment = require('moment');
const JobListing = require('../models/jobListingsModel');
const User = require('../models/userModel');
const sendEmailReminder = require('../util/sendinblue');
const { Op } = require('sequelize');

const reminderJob = cron.schedule('44 18 * * *', async()=>{
    console.log("Running reminder job...");
    const today = moment().startOf('day');
    const targetDates = [
        moment().add(1, 'days').format('YYYY-MM-DD'),
        moment().add(2, 'days').format('YYYY-MM-DD'),
      ];
    try{
        const upcomingJobs = await JobListing.findAll({
            where:{
            applyBy: {
                [Op.in]: targetDates,
              }},
            include:[{model:User}]
        });
        for(const job of upcomingJobs){
            const userEmail = job.User?.email;
            if (userEmail) {
                await sendEmailReminder(userEmail, job.title, job.applyBy, job.companyName);
              }
     }
    }
    catch(err){
        console.error("Cron job error:", err);
    }
})
module.exports = reminderJob;
