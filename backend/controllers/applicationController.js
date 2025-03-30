const Application = require('../models/jobApplicationModel')
const Company = require('../models/companiesModel')
const User = require('../models/userModel')
const sequelize = require('../util/database');
const AWS = require('aws-sdk');
const uploadToS3 = require('../services/S3services')
const multer = require('multer');
const JobApplication = require('../models/jobApplicationModel');

exports.postApplication = async(req, res)=>{
    try{
    const { companyName, jobTitle, applicationDate, status, notes } = req.body;
    if (!req.files || !req.files.resume || !req.files.coverLetter) {
        return res.status(400).json({ message: "Resume and Cover Letter are required." });
      }
  
    const resumeFile = req.files.resume?.[0];
    const coverLetterFile = req.files.coverLetter?.[0];
    const resumename = `${Date.now()}-${resumeFile.originalname}`;
    const covername = `${Date.now()}-${coverLetterFile.originalname}`;
    const resumeUrl = await uploadToS3(resumeFile.buffer, resumename)
    console.log("this is url>>>>>", resumeUrl)
    const coverLetterUrl = await uploadToS3(coverLetterFile.buffer, covername)
    const newApplication = await Application.create({
        companyName,
        jobTitle,
        applicationDate,
        status,
        notes,
        resumeUrl,
        coverLetterUrl,
        userId: req.user.dataValues.id
      });
     return res.status(200).json({message: "Application created",
        newApplication
      })
    }
    catch(err){
    console.log("Error creating application", err);
   return res.status(500).json({message:"Database error"})
    }
}
exports.getApplications = async(req, res)=>{
  try{
 const userId= req.user.dataValues.id;
 const applications = await JobApplication.findAll({where:{userId:userId}});
 return res.status(200).json({applications})
  }
  catch(err){
    console.log(err);
  return res.status(500).json({message:"Database error"})

  }
}