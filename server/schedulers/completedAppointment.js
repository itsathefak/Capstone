const cron = require("node-cron");
const moment = require("moment");
const Appointment = require("../models/Appointment");

const statusCompleted = async () => {
  try {
    const currentTime = moment();

    // find all appointments which are confirmed
    const appointments = await Appointment.find({ status: "Confirmed" });

    // format the end date and time and convert it to moment object
    appointments.forEach(async (appointment) => {
      const appointmentEndTime = moment(
        `${appointment.date.toISOString().split("T")[0]} ${
          appointment.endTime
        }`,
        "YYYY-MM-DD hh:mm A"
      );

      // if the current time is after end time - appointment is completed
      if (currentTime.isAfter(appointmentEndTime)) {
        appointment.status = "Completed";
        await appointment.save();
      }
    });
  } catch (error) {
    console.error("Error checking appointments:", error);
  }
};

// execute the function once when the server starts
statusCompleted();

// schedule to execute this function at 2nd and 32nd minute of every hour
cron.schedule("2,32 * * * *", statusCompleted);