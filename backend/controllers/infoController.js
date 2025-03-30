const UserDetails = require('../models/userDetailsModel');
const User = require('../models/userModel');

exports.postPersonalInfo = async (req, res) => {
  const userId = req.user.dataValues.id;
  const { address, primary, secondary, graduation } = req.body;

  try {
    // Check if userDetails already exists for this user
    const existingDetails = await UserDetails.findOne({ where: { userId } });

    if (existingDetails) {
      // Update existing record
    const newDetails =  await existingDetails.update({
        address,
        primaryEducation: primary,
        secondaryEducation: secondary,
        graduationDetails: graduation
      });
      return res.status(200).json({
        message: 'Profile info updated successfully',
        details: newDetails
      });
    }

    // Else create new record
   const newDetails= await UserDetails.create({
      address,
      primaryEducation: primary,
      secondaryEducation: secondary,
      graduationDetails: graduation,
      userId
    });

    return res.status(201).json({ message: 'Profile info saved successfully',
        details:newDetails
     });

  } catch (error) {
    console.error('Error saving profile info:', error);
    return res.status(500).json({ message: 'Server error saving profile info' });
  }
};

exports.postCareerInfo= async(req, res)=>{
    const {jobType, experience, github, linkedin} = req.body;
    const userId = req.user.dataValues.id;
    try{
const existingDetails = await UserDetails.findOne({where:{userId}})
if(existingDetails){
   const newDetails= await existingDetails.update({
        jobType,
        experienceLevel: experience,
        linkedinUrl:linkedin,
        githubUrl:github
    })
    return res.status(201).json({message: 'Career info updated',
        details: newDetails
    })
}
const newDetails= await existingDetails.create({
    jobType,
    experienceLevel: experience,
    linkedinUrl:linkedin,
    githubUrl:github
})
return res.status(200).json({message: 'Career info saved',
    details: newDetails
})
    }
    catch(error){
    console.log(error);
    return res.status(500).json({message:'Server error while saving career info'})
    }
}

exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user.dataValues.id;
    const details = await UserDetails.findOne({ where: { userId } });

    if (!details) {
      return res.status(404).json({ message: 'User details not found' });
    }

    res.status(200).json(details);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

