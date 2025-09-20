const express = require("express");
const router = express.Router();
const { allUsers, singleUser, editUser, deleteUser, createUserJobsHistory } = require('../controllers/userControllers');
const { isAuthenticated, isAdmin } = require("../middleware/auth")

//user routes

router.get('/allusers',isAuthenticated,isAdmin, allUsers);
//api/allusers/id
router.get('/users/:id',isAuthenticated, singleUser);
//api/allusers/edit/id
router.put('/users/edit/:id',isAuthenticated, editUser);
//api/admin/user/delete/id
router.delete('/admin/users/delete/:id',isAuthenticated, isAdmin, deleteUser);
//api/users/jobhistory
router.post('/user/jobhistory',isAuthenticated, createUserJobsHistory);

module.exports = router;