//const pool = 'postgres://naveen:1234@localhost:5432/naveen';
const pool = process.env.NODE_ENV=='production'?process.env.DATABASE_URL:'postgres://naveen:1234@localhost:5432/naveen';
const {Client} = require('pg');
const client = new Client({
  connectionString: pool
});

client.connect();

function generateA_id() {
  var ts = Date.now();
  ts = String(ts);
  li = [1,2,3,4,5,6,7,8,9,0,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  var ran = [];
  var nd = ts.length
  for(var i=0;i<5;i++){
    var a = Math.round(Math.random() * Math.pow(10,nd))
    a = a % li.length
    ran = ran + li[a]
  }
  console.log('G'+ts.slice(0,7)+'A'+ran+'N'+ts.slice(7,nd)+'I');
  return ('G'+ts.slice(0,7)+'A'+ran+'N'+ts.slice(7,nd)+'I');
}

const createJobs = (req,res) => {
  console.log("database");
  if(req.body.number < 1) {
    client.query('select * from jobs', function (err,result) {
      console.log(result)
      res.render('modifyJobsPage',{
        list: result.rows,
        err : "Job openings must be > 0"
      });
    })
  }
  else {
    console.log("in CREATE Jobs function name is "+req.body.name);
    client.query('select job_title from jobs where job_title=$1',[req.body.name], function (err, result, fields) {
      if (!result.rowCount) {
        client.query('insert into jobs (job_title,openings) values ($1, $2)',[req.body.name,req.body.number])
        console.log("inserted");
        client.query('select * from jobs', function (err,result) {
          console.log(result)
          res.render('modifyJobsPage',{
            list: result.rows
          });
        })
      }
      else {
        client.query('update jobs set openings = $2 where job_title=$1;',[req.body.name,req.body.number])
        console.log("updated");
        client.query('select * from jobs', function (err,result) {
          console.log(result)
          res.render('modifyJobsPage',{
            list: result.rows
          });
        })
      }
    });
  }
}

const deleteJobs = (req,res) => {
  client.query('delete from jobs where job_title=$1;',[req.body.name])
  console.log("deleted");
  client.query('select * from jobs', function (err,result) {
    console.log(result)
    res.render('modifyJobsPage',{
      list: result.rows
    });
  })
}

const modifyJobsPage = (req,res) => {
    client.query('select * from jobs', function (err,result) {
    console.log(result)
    res.render('modifyJobsPage',{
      list: result.rows
    });
  })
}

const applicantPage = (req,res) => {
  client.query('select * from jobs', function (err,result) {
    var jobs=[]
    for (var i = 0; i < result.rowCount; i++) {
      jobs.push(result.rows[i].job_title)
    }
    console.log(jobs)
    res.render('applicantPage',{
      list: result.rows,
      jobs: jobs
    });
  })
}

const applicantSubmit= (req,res) => {
  console.log("insert into applicant");
  console.log(req.body.jobs);
  client.query('insert into applicant (a_id,name,email,phone,job_title) values ($1, $2, $3, $4, $5)',[generateA_id(),req.body.name,req.body.email,req.body.phone,req.body.jobs])
  client.query('select * from jobs', function (err,result) {
    var jobs=[]
    for (var i = 0; i < result.rowCount; i++) {
      jobs.push(result.rows[i].job_title)
    }
    console.log(jobs)
    res.render('applicantPage',{
      list: result.rows,
      jobs: jobs
    });
  })
}

const admin = (req,res) => {
  console.log("user in adminLoginPage")
  if(req.body.name=="dsce" && req.body.password=="1234"){
    console.log("correct details")
    client.query('select name,email,phone,job_title from applicant', function (err,result) {
      console.log(result.rows)
      res.render('adminPage',{
        list: result.rows
      });
    })
  }
  else{
    console.log("Incorrect Login Credentials")
    res.render('adminLoginPage',{
      text:"Incorrect Login Credentials"
    });
  }
}

module.exports = {
  createJobs,
  deleteJobs,
  modifyJobsPage,
  applicantPage,
  applicantSubmit,
  admin
};
