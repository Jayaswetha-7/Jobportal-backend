const User = require('../models/userModel');
const errorResponse = require('../utilis/errorResponse');

exports.allUsers = async (req, res, next) =>{
    //enable paginatin
    const pageSize = 10
    const page = Number(req.query.pageNumber) || 1;
    const count = await User.find({}).estimatedDocumentCount();
    try {
        const users = await User.find().sort({ createdAt: -1 }).select('-password')
           .skip(pageSize * (page-1))
           .limit(pageSize)
        res.status(200).json({
        success: true,
        users,
        page,
        pages: Math.ceil(count / pageSize),
        count
    })
    next();
    } catch (error) {
        return next(error);
    }
}                                 

//show single user

exports.singleUser = async (req, res, next) =>{
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({
            success: true,
            user
        })
        next();
    } catch (error) {
        return next(error);   
     }
}

//edit user

exports.editUser = async (req, res, next) =>{
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true});
        res.status(200).json({
            success: true,
            user
        })
        next();
    } catch (error) {
        return next(error);   
     }
}

//delete user

exports.deleteUser = async (req, res, next) =>{
    try {
        const user = await User.findByIdAndRemove(req.params.id);
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
        next();
    } catch (error) {
        return next(error);   
     }
}

//jobs hstory

exports.createUserJobsHistory = async (req, res, next) =>{
    const {title, description,location,salary} = req.body;
    try {
        const currentuser = await User.findOne({_id: req.user._id});
        if (!currentuser){
            return next(new ErrorResponse('you must log In'), 401);
        }else{
            const addJobHistory = {
                title,
                description,
                location,
                salary,
                user: req.user._id 
            }
            currentuser.jobsHistory.push(addJobHistory);
            await currentuser.save();
        }
       
        res.status(200).json({
            success: true,
            currentuser
        })
        next();
    } catch (error) {
        return next(error);   
     }
}