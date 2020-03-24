const Appointment = require("../models/Appointment");
const User = require("../models/User");
const File = require("../models/File");
const Yup = require("yup");
const {
  startOfHour,
  parseISO,
  isBefore,
  format,
  subHours
} = require("date-fns");
const pt = require("date-fns/locale/pt");
const Notification = require("../schemas/notification");
const Queue = require("../../lib/Queue");
const CancellationMail = require("../jobs/CancellationMail");

class AppointmentController {
  async index(req, res) {
    const { page = 1, items = 20 } = req.query;

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null
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
              attributes: ["path", "url"]
            }
          ]
        }
      ]
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation Fails" });
    }

    const { provider_id, date } = req.body;

    const isProvider = await User.findOne({
      where: { id: provider_id }
    });

    if (!isProvider) {
      return res.status(401).json({ error: "user is not a provider" });
    }

    const hourStart = startOfHour(parseISO(date));

    //check for past dates
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({
        error: "Past date is not permitted"
      });
    }

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart
      }
    });

    if (checkAvailability) {
      return res.status(400).json({
        error: "Date is not available"
      });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart
    });

    //notify appointment provider

    const { name } = await User.findByPk(req.userId);
    const formattedDate = format(hourStart, "'dia' dd 'de' MMMM', às' H:mm", {
      locale: pt
    });

    await Notification.create({
      content: `Novo agendamento de ${name} para o ${formattedDate}`,
      user: provider_id
    });

    return res.json({ appointment });
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["name", "email"]
        },
        {
          model: User,
          as: "user",
          attributes: ["name"]
        }
      ]
    });

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appointment"
      });
    }

    const dateWithSubHours = subHours(appointment.date, 2);

    if (isBefore(dateWithSubHours, new Date())) {
      return res.status(401).json({
        error: "You can only cancel appointments 2 hours in advance"
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, { appointment });

    return res.json(appointment);
  }
}

module.exports = new AppointmentController();
