const User = require('../models/userModel');
const ErrorResponse = require('../utilis/errorResponse');


//signup
exports.signup = async (req, res, next) => {
  const { email } = req.body;
  const userExist = await User.findOne({ email });

  if (userExist) {
    return next(new ErrorResponse("E-mail is already registered", 400));
  }

  try {
    const user = await User.create(req.body);

    sendTokenResponse(user, 201, res);

  } catch (error) {
    next(error);
  }
};

//signin
exports.signin = async (req, res, next) => {
 
  try {
    const { email, password } = req.body;
  //validation
    if (!email) {
      return next(new ErrorResponse("Please enter your email", 403));
    }
    if (! password) {
      return next(new ErrorResponse("Please enter your  password", 403));
    }

    //check user email
    const user = await User.findOne({ email });
    if (! user) {
      return next(new ErrorResponse("Invalid credential", 400));
    }
    //password check
    const isMatched = await user.comparePassword(password)
    if (! isMatched) {
      return next(new ErrorResponse("Invalid credential", 400));
    }

    sendTokenResponse(user, 200, res);

  } catch (error) {
    next(error);
  }
};

const sendTokenResponse = async (user, codeStatus, res) => {
  const token = await user.getJwtToken();
  res
      .status(codeStatus)
      .cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true })
      .json({
          success: true,
          role: user.role,
          user,
      })
}

//logout
exports.logout = (req, res, next) =>{
     res.clearCookie("token");
     res.status(200).json({
       success: true,
       message:"loged out successfully"
     })
}


//user profile
exports.userProfile = async (req,res,next) =>{
  const user = await User.findById(req.user.id).select('-password');
  res.status(200).json({
    success: true,
    user
  })
}