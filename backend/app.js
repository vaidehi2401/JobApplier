const express = require('express');
const path = require("path"); 
const fs = require('fs')
const userRoutes = require('./routes/userRoutes')
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const companyRoutes = require('./routes/companyRoutes')
const cors = require('cors'); 
const reminderJob = require('./jobs/reminderCron')

const app = express();
app.use(cors())
app.use(bodyParser.json())
reminderJob.start();
app.use('/api/users', userRoutes)
app.use('/api/company', companyRoutes )
sequelize.sync()
.then(()=>{
    app.listen(process.env.PORT_NO);
})
.catch((err)=>{
    console.log(err);
})
