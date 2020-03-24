const Appointments = require("../models/Appointment");
const {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter
} = require("date-fns");
const { Op } = require("sequelize");

class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Invalid Date" });
    }

    const seachDate = Number(date);

    const appointments = await Appointments.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(seachDate), endOfDay(seachDate)]
        }
      }
    });

    const schedule = [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00"
    ];

    const availables = schedule.map(time => {
      const [hour, minute] = time.split(":");
      const value = setSeconds(
        setMinutes(setHours(seachDate, hour), minute),
        0
      );

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) &&
          !appointments.find(a => format(a.date, "HH:mm") == time)
      };
    });

    return res.json(availables);
  }
}

module.exports = new AvailableController();
