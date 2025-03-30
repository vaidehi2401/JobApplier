const express = require('express');
const authenticate = require('../middleware/auth')
const router = express.Router();
const companyController = require('../controllers/companiesController')
const upload = require('../middleware/multer');
const applicationController = require('../controllers/applicationController');
router.post('/companyInfo',authenticate, companyController.postCompanyInfo);
router.post('/jobListing', authenticate, companyController.postJobListingInfo)
router.get('/getCompanies', authenticate, companyController.getCompanies)
router.get('/jobListings/:id', authenticate, companyController.getJobListings)
router.post(
    '/application',
    authenticate,
    upload.fields([
      { name: 'resume', maxCount: 1 },
      { name: 'coverLetter', maxCount: 1 }
    ]), authenticate,
    applicationController.postApplication
  );
  router.get('/getApplications', authenticate, applicationController.getApplications)
  
module.exports=router;