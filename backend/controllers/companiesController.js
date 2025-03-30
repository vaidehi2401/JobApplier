const Company = require('../models/companiesModel');
const JobListing = require('../models/jobListingsModel');

// POST: Create Company Info
exports.postCompanyInfo = async (req, res) => {
  const userId = req.user.dataValues.id;
  const { name, industry, size, contact, notes } = req.body;

  try {
    const existingCompany = await Company.findOne({ where: { name } });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company with this name already exists.' });
    }

    const newCompany = await Company.create({
      name,
      industry,
      size,
      contactEmail: contact,
      notes,
      userId,
    });

    res.status(201).json(newCompany);
  } catch (error) {
    console.error("Error creating company info:", error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST: Create Job Listing
exports.postJobListingInfo = async (req, res) => {
  const userId = req.user.dataValues.id;
  const { title, description, status, applyBy, notes, companyName } = req.body;

  try {
    const company = await Company.findOne({ where: { name: companyName, userId } });

    if (!company) {
      return res.status(404).json({ message: 'Company not found. Please add the company first.' });
    }

    const newJobListing = await JobListing.create({
      title,
      description,
      status,
      applyBy,
      notes,
      companyName: company.name,
      userId,
      companyId: company.id
    });

    res.status(201).json(newJobListing);
  } catch (error) {
    console.error("Error creating job listing:", error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
exports.getCompanies = async(req, res)=>{
  try{
  const userId = req.user.dataValues.id;
  const companies = await Company.findAll({where: {userId:userId}})
  res.status(200).json({message: "Fetched companies successfully",
    companies: companies
  })
  }
  catch(error){
  console.log("Error fetching companies", error)
  res.status(500).json({ message: 'Internal server error.' });
  }
}
exports.getJobListings = async(req, res)=>{
  try{
    const id = req.params.id;
    const userId = req.user.dataValues.id;
    const jobListings = await JobListing.findAll({where:{companyId: id, userId:userId}})
    res.status(200).json({message: "Fetched jobs successfully",
      jobListings: jobListings
    })
  }
  catch(error){
 console.log(error);
 res.status(500).json({ message: 'Internal server error.' });
  }
}
