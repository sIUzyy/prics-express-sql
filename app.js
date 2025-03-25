// ---- dependencies ----
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

// ---- middleware ----
const dbMiddleware = require("./middleware/db-middleware");

// ---- env ----
const PORT = process.env.PORT || process.env.ALTER_SERVER_PORT;

// ---- route ----
const activityRoutes = require("./routes/activity-route");
const driverRoutes = require("./routes/driver-route");

// ---- initialize an express ----
const app = express();

// ---- this will parse any incoming request body and extract any json data ----
app.use(bodyParser.json());

// ---- cors middleware ----
app.use(
  cors({
    origin: "*", // You can replace "*" with your frontend's URL, like "http://localhost:5000"
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  })
);

// ---- initialize db-middleware (automatically adds DB connection to req) ----
app.use(dbMiddleware);

// ---- middleware for routes ----
app.use("/api/activity", activityRoutes);
app.use("/api/driver", driverRoutes);

// ---- error handling middleware ----
app.use((error, req, res, next) => {
  // check if response has already been sent
  if (res.headerSent) {
    return next(error); // if yes, we won't send a response on our own.
  }

  // if we have code status, if we don't have code status send 500 status
  res.status(error.code || 500);

  // check if there's an error message, if we don't show the default message.
  res.json({ message: error.message || "An unknown error occured." });
});

// ---- display the connection ----
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
