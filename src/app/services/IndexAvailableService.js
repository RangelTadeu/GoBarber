const Appointments = require("../models/Appointment");
const {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} = require("date-fns");
const { Op } = require("sequelize");

class IndexAvailableService {
  async run({ provider_id, seachDate }) {
    const appointments = await Appointments.findAll({
      where: {
        provider_id: provider_id,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(seachDate), endOfDay(seachDate)],
        },
      },
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
      "19:00",
    ];

    const availables = schedule.map((time) => {
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
          !appointments.find((a) => format(a.date, "HH:mm") == time),
      };
    });

    return availables;
  }
}

module.exports = new IndexAvailableService();
