const express = require('express');
const hbs = require('hbs');
const path = require('path');
const PORT = process.env.PORT || 8000
var db = require('./database');
const bodyParser = require('body-parser');
const app = express();

app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',(req,res) => {
  console.log("user in jobPage")
  res.render('jobPage');
});

app.get('/admin',(req,res) => {
  console.log("user in adminLoginPage")
  res.render('adminLoginPage');
});

app.post('/admin', db.admin)
app.get('/applicant', db.applicantPage);
app.post('/applicant', db.applicantSubmit);
app.post('/modifyjobs', db.modifyJobsPage);
app.post('/modifyjobsCre',db.createJobs);
app.post('/modifyjobsDel',db.deleteJobs);

app.listen(PORT,() => {
  console.log('Server is running at port '+PORT);
})
