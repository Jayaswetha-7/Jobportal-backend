const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/auth")
const { createJob, singleJob, updateJob, showJobs,deleteJob } = require("../controllers/jobsControllers")
//jobs routes

//api/job/create
router.post('/job/create',isAuthenticated,isAdmin, createJob);
//api/job/id
router.get('/job/:id', singleJob);
//api/job/update
router.put('/job/update/:job_id',isAuthenticated,isAdmin, updateJob);
//api/jobs/show
router.get('/jobs/show', showJobs);
//api/job/id/delete
router.delete('/job/delete/:id', deleteJob);

module.exports = router;