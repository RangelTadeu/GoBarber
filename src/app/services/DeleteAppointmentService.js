const Queue = require("../../lib/Queue");
const CancellationMail = require("../jobs/CancellationMail");
const { isBefore, subHours } = require("date-fns");
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Cache = require("../../lib/Cache");

class DeleteAppointmentService {
  async run({ appointment_id, user_id }) {
    const appointment = await Appointment.findByPk(appointment_id, {
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["name", "email"],
        },
        {
          model: User,
          as: "user",
          attributes: ["name"],
        },
      ],
    });

    if (appointment.user_id !== user_id) {
      throw new Error("You don't have permission to cancel this appointment");
    }

    const dateWithSubHours = subHours(appointment.date, 2);

    if (isBefore(dateWithSubHours, new Date())) {
      throw new Error("You can only cancel appointments 2 hours in advance");
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, { appointment });

    //invalidade cache

    await Cache.invalidatePrefix(`user:${user_id}:appointments`);

    return appointment;
  }
}

module.exports = new DeleteAppointmentService();
