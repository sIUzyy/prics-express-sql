// ---- dependencies ----
require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// ---- middleware ----
const dbMiddleware = require("./middleware/db-middleware");

// ---- env ----
const PORT = process.env.PORT || process.env.ALTER_SERVER_PORT;

// ---- route ----
const preDeliveryRoutes = require("./routes/pre-delivery-route");
const warehouseRoutes = require("./routes/warehouse-route");
const shipmentRoutes = require("./routes/shipment-route");
const activityRoutes = require("./routes/activity-route");
const apptRoutes = require("./routes/appointment-route");
const productRoutes = require("./routes/product-route");
const driverRoutes = require("./routes/driver-route");
const truckRoutes = require("./routes/truck-route");
const userRoutes = require("./routes/user-route");

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

// ---- static serving ----
app.use("/uploads/images", express.static(path.join("uploads", "images"))); // static serving

// ---- enable cors for static serving ----
app.use("/uploads/images", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins (change to specific URL in production)
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// ---- initialize db-middleware (automatically adds DB connection to req) ----
app.use(dbMiddleware);

// ---- middleware for routes ----
app.use("/api/pre-delivery", preDeliveryRoutes);
app.use("/api/warehouse", warehouseRoutes);
app.use("/api/shipment", shipmentRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/appointment", apptRoutes);
app.use("/api/product", productRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/truck", truckRoutes);
app.use("/api/user", userRoutes);

// ---- error handling middleware ----
app.use((error, req, res, next) => {
  // multer
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    }); // delete the image if theres an error
  }

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
