const Job = require("../models/jobModel");
const JobType = require("../models/jobTypemodel");
const ErrorResponse = require('../utilis/errorResponse');

//create job
exports.createJob = async (req, res, next) => {
    try {
        const job = await Job.create({
            title: req.body.title,
            description: req.body.description,
            salary: req.body.salary,
            location: req.body.location,
            jobType: req.body.jobType,
            user: req.user.id
        });
        res.status(201).json({
            success: true,
            job
        })
    } catch (error) {
        next(error);
    }
}


//single job
exports.singleJob = async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        res.status(200).json({
            success: true,
            job
        })
    } catch (error) {
        next(error);
    }
}

//delete job
exports.deleteJob = async (req, res, next) => {

    try {
        const job = await Job.findByIdAndRemove(req.params.id);

        if (!job) {
            return res.status(404).json({
              success: false,
              message: "Job not found"
            });
          }
        res.status(200).json({
            success: true,
            message: "Job deleted successfully",
            job
        })
    } catch (error) {
        next(error);
    }
}


//update job by id.
exports.updateJob = async (req, res, next) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.job_id, req.body, { new: true }).populate('jobType', 'jobTypeName').populate('user', 'firstName lastName');
        res.status(200).json({
            success: true,
            job
        })
    } catch (error) {
        next(error);
    }
}




// show all jobs
exports.showJobs = async (req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
  
    // enable search
    let keyword = {};
    if (typeof req.query.keyword === "string" && req.query.keyword.trim() !== "") {
      keyword = {
        title: {
          $regex: new RegExp(req.query.keyword.split("").join(".*"), "i"),
        },
      };
    }
  
    // filter jobs by category ids
    let ids = [];
    const jobTypeCategory = await JobType.find({}, { _id: 1 });
    jobTypeCategory.forEach((cat) => {
      ids.push(cat._id);
    });
  
    let categ = ids; // default all categories
    if (typeof req.query.cat === "string" && req.query.cat.trim() !== "") {
      categ = req.query.cat;
    }
  
    // jobs by location
    let locations = [];
    const jobByLocation = await Job.find({}, { location: 1 });
    jobByLocation.forEach((val) => {
      locations.push(val.location);
    });
    let setUniqueLocation = [...new Set(locations)];
  
    let locationFilter = { $in: setUniqueLocation }; // default: all locations
    if (typeof req.query.location === "string" && req.query.location.trim() !== "") {
      locationFilter = { $regex: req.query.location, $options: "i" };
    }
  
    // enable pagination
    const pageSize = 5;
    const page = Number(req.query.pageNumber) || 1;
  
    try {
      const count = await Job.find({
        ...keyword,
        jobType: categ,
        location: locationFilter,
      }).countDocuments();
  
      const jobs = await Job.find({
        ...keyword,
        jobType: categ,
        location: locationFilter,
      })
        .populate("jobType", "jobTypeName")
        .populate("user", "firstName")
        .sort({ createdAt: -1 })
        .skip(pageSize * (page - 1))
        .limit(pageSize);
  
      res.status(200).json({
        success: true,
        jobs,
        page,
        pages: Math.ceil(count / pageSize),
        count,
        setUniqueLocation,
      });
    } catch (error) {
      next(error);
    }
  };
  