const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/auth")
const { createJobType, allJobType, updateJobType, deleteJobType } = require("../controllers/jobTypeControllers")

//job type routes

//api/type/create
router.post('/type/create',isAuthenticated,isAdmin, createJobType);

//api/type/job
router.get('/type/jobs', allJobType);
//api/type/update/id
router.put('/type/update/:type_id',isAuthenticated,isAdmin, updateJobType);
//api/type/delete
router.delete('/type/delete/:type_id',isAuthenticated,isAdmin, deleteJobType);


module.exports = router;