const Appointment = require("../models/Appointment");
const User = require("../models/User");
const File = require("../models/File");

const CreateAppointmentService = require("../services/CreateAppointmentService");
const DeleteAppointmentService = require("../services/DeleteAppointmentService");

const Cache = require("../../lib/Cache");

class AppointmentController {
  async index(req, res) {
    const { page = 1, items = 20 } = req.query;

    const cacheKey = `user:${req.userId}:appointments:${page}`;
    const cached = await Cache.get(cacheKey);

    if (cached) {
      return res.json(cached);
    }

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      order: ["date"],
      attributes: ["id", "date", "past", "cancelable"],
      limit: items,
      offset: (page - 1) * items,
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["id", "name"],
          include: [
            {
              model: File,
              as: "avatar",
              attributes: ["path", "url"],
            },
          ],
        },
      ],
    });

    Cache.set(cacheKey, appointments);

    return res.json(appointments);
  }

  async store(req, res) {
    const { provider_id, date } = req.body;

    try {
      const appointment = await CreateAppointmentService.run({
        provider_id,
        user_id: req.userId,
        date,
      });

      return res.json(appointment);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const appointment = await DeleteAppointmentService.run({
        appointment_id: req.params.id,
        user_id: req.userId,
      });

      return res.status(200).json(appointment);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}

module.exports = new AppointmentController();
