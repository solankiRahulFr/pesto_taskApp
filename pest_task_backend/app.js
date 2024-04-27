const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const logger = require("./utils/logger");
const config = require("./utils/config");
const middleware = require("./utils/middleware");
const usersRouter = require("./controllers/user");
const loginRouter = require("./controllers/login");
const taskRouter = require("./controllers/task");

// initializing the app
const app = express();

// Connecting to the DB
mongoose.set("strictQuery", false);
logger.info("Connecting to", config.MONGODB_URI);
mongoose.connect(config.MONGODB_URI)
    .then(() => logger.info("Connected to the MongoDB"))
    .catch(err => logger.error("Error connectng : ", err))

app.use(cors());
// app.use(express.static("dist"));
app.use(express.json());

// Extrating token for user login
app.use(middleware.tokenExtractor);

//  Request logger
app.use(morgan('tiny'))

// Serving UI
app.use(express.static('dist'))

// API routes
app.use("/api/users", usersRouter);
app.use('/api/login', loginRouter);
app.use("/api/task", taskRouter);

// Error Handling 
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;