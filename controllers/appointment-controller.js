// ---- dependency ----
const sql = require("mssql");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

// ---- extend dayjs with plugins ----
dayjs.extend(utc);
dayjs.extend(timezone);

// ---- model ----
const HttpError = require("../models/error/http-error");

// ---- controller ----

// http://localhost:8000/api/appointment/create-appointment - POST
const createAppointment = async (req, res, next) => {
  // ---- request body (expected to get from end-user)
  const {
    appointment_id,
    appointment_date,
    appointment_time,
    carrier_name,
    warehouse_name,
    warehouse_address,
    driver_name,
    helper_name,
    parking_slot,
    dock,
    plate_no,
    activity,
    status,
    time_in,
    time_out,
  } = req.body;

  if (
    !appointment_id ||
    !appointment_date ||
    !appointment_time ||
    !carrier_name ||
    !warehouse_name ||
    !warehouse_address ||
    !driver_name ||
    !helper_name ||
    !parking_slot ||
    !dock ||
    !plate_no ||
    !activity ||
    !status
  ) {
    return next(new HttpError("All required fields must be filled", 400));
  }

  try {
    const pool = await req.db; // get the database connection
    await pool
      .request()
      .input("appointment_id", sql.NVarChar(50), appointment_id)
      .input("appointment_date", sql.Date, appointment_date)
      .input("appointment_time", sql.NVarChar(10), appointment_time)
      .input("carrier_name", sql.NVarChar(100), carrier_name)
      .input("warehouse_name", sql.NVarChar(100), warehouse_name)
      .input("warehouse_address", sql.NVarChar(255), warehouse_address)
      .input("driver_name", sql.NVarChar(100), driver_name)
      .input("helper_name", sql.NVarChar(100), helper_name)
      .input("parking_slot", sql.NVarChar(20), parking_slot)
      .input("dock", sql.NVarChar(20), dock)
      .input("plate_no", sql.NVarChar(10), plate_no)
      .input("activity", sql.NVarChar(100), activity)
      .input("status", sql.NVarChar(50), status)
      .input("time_in", sql.NVarChar(30), time_in || null)
      .input("time_out", sql.NVarChar(30), time_out || null)
      .execute("createAppointment");

    res.status(201).json({ message: "Appointment created successfully" });
  } catch (err) {
    console.error("Error creating appointment:", err);
    const error = new HttpError(
      "Failed to create an appointment. Please try again later.",
      500
    );
    return next(error);
  }
};

// http://localhost:8000/api/appointment/ - GET
const getAppointments = async (req, res, next) => {
  try {
    const pool = await req.db; // Get the database connection
    const result = await pool.request().execute("getAppointments");

    res.status(200).json(result.recordset); // Send the retrieved appointments as a JSON response
  } catch (err) {
    console.error("Error fetching appointments:", err);
    const error = new HttpError(
      "Failed to retrieve appointments. Please try again later.",
      500
    );
    return next(error);
  }
};

// http://localhost:8000/api/appointment/:appointment_id/gate-pass - GET
const getAppointmentByApptId = async (req, res, next) => {
  const { appointment_id } = req.params; // Get appointment_id from URL parameters

  if (!appointment_id) {
    return next(new HttpError("Appointment ID is required", 400));
  }

  try {
    const pool = await req.db; // Get the database connection
    const result = await pool
      .request()
      .input("appointment_id", sql.NVarChar(50), appointment_id)
      .execute("getAppointmentByApptId");

    if (result.recordset.length === 0) {
      return next(new HttpError("Appointment not found", 404));
    }

    res.status(200).json(result.recordset[0]); // Send the retrieved appointment as a JSON response
  } catch (err) {
    console.error("Error fetching appointment:", err);
    const error = new HttpError(
      "Failed to retrieve appointment by appt id. Please try again later.",
      500
    );
    return next(error);
  }
};

// http://localhost:8000/api/appointment/:plate_no/driver - GET
const getAppointmentByPlateNo = async (req, res, next) => {
  const { plate_no } = req.params; // Get plate_no from URL parameters

  if (!plate_no) {
    return next(new HttpError("Plate number is required", 400));
  }

  try {
    const pool = await req.db; // Get the database connection
    const result = await pool
      .request()
      .input("plate_no", sql.NVarChar(10), plate_no)
      .execute("getAppointmentByPlateNo");

    if (result.recordset.length === 0) {
      return next(
        new HttpError("Appointment not found for this plate number", 404)
      );
    }

    res.status(200).json(result.recordset); // Send the retrieved appointments as a JSON response
  } catch (err) {
    console.error("Error fetching appointment:", err);
    const error = new HttpError(
      "Failed to retrieve appointment by plate_no. Please try again later.",
      500
    );
    return next(error);
  }
};

// http://localhost:8000/api/appointment/:appointment_id/update-appointment - PATCH
const updateAppointmentByApptId = async (req, res, next) => {
  const { appointment_id } = req.params;
  const {
    appointment_date,
    appointment_time,
    carrier_name,
    warehouse_name,
    warehouse_address,
    driver_name,
    helper_name,
    parking_slot,
    dock,
    plate_no,
    activity,
    status,
    time_in,
    time_out,
  } = req.body;

  if (!appointment_id) {
    return next(new HttpError("Appointment ID is required", 400));
  }

  try {
    const pool = await req.db; // Get the database connection
    const result = await pool
      .request()
      .input("appointment_id", sql.NVarChar(50), appointment_id)
      .input("appointment_date", sql.Date, appointment_date)
      .input("appointment_time", sql.NVarChar(10), appointment_time)
      .input("carrier_name", sql.NVarChar(100), carrier_name)
      .input("warehouse_name", sql.NVarChar(100), warehouse_name)
      .input("warehouse_address", sql.NVarChar(255), warehouse_address)
      .input("driver_name", sql.NVarChar(100), driver_name)
      .input("helper_name", sql.NVarChar(100), helper_name)
      .input("parking_slot", sql.NVarChar(20), parking_slot)
      .input("dock", sql.NVarChar(20), dock)
      .input("plate_no", sql.NVarChar(10), plate_no)
      .input("activity", sql.NVarChar(100), activity)
      .input("status", sql.NVarChar(50), status)
      .input("time_in", sql.NVarChar(30), time_in)
      .input("time_out", sql.NVarChar(30), time_out)
      .execute("updateAppointmentByApptId");

    res.status(200).json({ message: "Appointment updated successfully" });
  } catch (err) {
    console.error("Error updating appointment:", err);
    const error = new HttpError(
      "Failed to update appointment. Please try again later.",
      500
    );
    return next(error);
  }
};

// http://localhost:8000/api/appointment/:appointment_id/gate-pass/time-in - PATCH
const updateTimeInByApptId = async (req, res, next) => {
  const { appointment_id } = req.params;

  try {
    const pool = await req.db; // Get the database connection

    // retrieve the appointment date
    const appointmentResult = await pool
      .request()
      .input("appointment_id", sql.NVarChar(50), appointment_id)
      .query(
        "SELECT appointment_date, time_in FROM appointments WHERE appointment_id = @appointment_id"
      );

    if (appointmentResult.recordset.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const appointment = appointmentResult.recordset[0];

    // get today's date and the appointment date
    const today = dayjs().tz("Asia/Manila").startOf("day"); // start of today (Manila time)
    const appointmentDate = dayjs
      .utc(appointment.appointment_date)
      .tz("Asia/Manila")
      .startOf("day"); // convert UTC to Manila time

    if (!appointmentDate.isSame(today, "day")) {
      return res.status(400).json({
        message: "This appointment is not scheduled for today.",
        appointment,
      });
    }

    // check if time_in already exists
    if (appointment.time_in) {
      return res.status(400).json({
        message: "Time-in already recorded",
      });
    }

    // get current time in Asia/Manila timezone
    const formattedTimeIn = dayjs()
      .tz("Asia/Manila")
      .format("YYYY-MM-DD HH:mm:ss");

    // update time_in and status in the database
    await pool
      .request()
      .input("appointment_id", sql.NVarChar(50), appointment_id)
      .input("time_in", sql.NVarChar(30), formattedTimeIn)
      .input("status", sql.NVarChar(50), "In Progress")
      .query(
        "UPDATE appointments SET time_in = @time_in, status = @status WHERE appointment_id = @appointment_id"
      );

    res.status(200).json({
      message: "Time-in recorded successfully",
      time_in: formattedTimeIn,
    });
  } catch (err) {
    console.error("Error updating time-in:", err);
    const error = new HttpError(
      "Failed to update time in by appt id. Please try again later.",
      500
    );
    return next(error);
  }
};

// http://localhost:8000/api/appointment/:appointment_id/gate-pass/time-out - PATCH
const updateTimeOutByApptId = async (req, res, next) => {
  const { appointment_id } = req.params;

  try {
    const pool = await req.db; // get the database connection

    // retrieve the appointment details
    const appointmentResult = await pool
      .request()
      .input("appointment_id", sql.NVarChar(50), appointment_id)
      .query(
        "SELECT time_in, time_out FROM appointments WHERE appointment_id = @appointment_id"
      );

    if (appointmentResult.recordset.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const appointment = appointmentResult.recordset[0];

    // ensure time_in is recorded before allowing time_out update
    if (!appointment.time_in) {
      return res
        .status(400)
        .json({ message: "Time-in must be recorded first" });
    }

    // prevent multiple updates to time_out
    if (appointment.time_out) {
      return res.status(400).json({
        message: "Time-out already recorded",
        appointment,
      });
    }

    // get current time in Asia/Manila timezone
    const formattedTimeOut = dayjs()
      .tz("Asia/Manila")
      .format("YYYY-MM-DD HH:mm:ss");

    // update time_out and status in the database
    await pool
      .request()
      .input("appointment_id", sql.NVarChar(50), appointment_id)
      .input("time_out", sql.NVarChar(30), formattedTimeOut)
      .input("status", sql.NVarChar(50), "Completed")
      .query(
        "UPDATE appointments SET time_out = @time_out, status = @status WHERE appointment_id = @appointment_id"
      );

    res.status(200).json({
      message: "Time-out recorded successfully",
      time_out: formattedTimeOut,
    });
  } catch (err) {
    console.error("Error updating time-out:", err);
    const error = new HttpError(
      "Failed to update time out by appt id. Please try again later.",
      500
    );
    return next(error);
  }
};

// http://localhost:8000/api/appointment/:appointment_id/delete-appointment - DELETE
const deleteAppointmentByApptId = async (req, res, next) => {
  const { appointment_id } = req.params;

  if (!appointment_id) {
    return next(new HttpError("Appointment ID is required", 400));
  }

  try {
    const pool = await req.db; // Get the database connection
    const result = await pool
      .request()
      .input("appointment_id", sql.NVarChar(50), appointment_id)
      .execute("deleteAppointmentByApptId");

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error("Error deleting appointment:", err);
    const error = new HttpError(
      "Failed to delete appointment. Please try again later.",
      500
    );
    return next(error);
  }
};

// ---- exports ----
exports.createAppointment = createAppointment;
exports.getAppointments = getAppointments;
exports.getAppointmentByApptId = getAppointmentByApptId;
exports.getAppointmentByPlateNo = getAppointmentByPlateNo;
exports.updateAppointmentByApptId = updateAppointmentByApptId;
exports.updateTimeInByApptId = updateTimeInByApptId;
exports.updateTimeOutByApptId = updateTimeOutByApptId;
exports.deleteAppointmentByApptId = deleteAppointmentByApptId;
