const express = require("express");
const app = express();
const mongoose = require("mongoose")
const morgan = require("morgan");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser")
require ("dotenv").config();
var cors = require("cors");
const errorHandler = require("./middleware/error")
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobTypeRoutes = require('./routes/jobtypeRoutes');
const jobRoutes = require('./routes/jobRoutes');

//database connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB connected successfully"))
  .catch(err => console.error('DB failed',err));

//middleware
app.use(morgan('dev'));
app.use(bodyparser.json({limit: '5mb'}));
app.use(bodyparser.urlencoded({
    limit: '5mb',
    extended: true
}));
app.use(cookieparser());
app.use(
  cors({
    origin: "https://jobportal-frontend-tau.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

//route for auth
app.use('/api', authRoutes);
//route for users
app.use('/api', userRoutes);
//route for jobtype
app.use('/api', jobTypeRoutes);
//route for job
app.use('/api', jobRoutes);
//middleware
app.use(errorHandler);

//port
const port = process.env.PORT || 8000

app.listen (port, () =>{
    console.log(`server running on port ${port}`)
})