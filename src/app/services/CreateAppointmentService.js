const { startOfHour, parseISO, isBefore, format } = require("date-fns");
const pt = require("date-fns/locale/pt");
const Notification = require("../schemas/notification");
const Appointment = require("../models/Appointment");
const Cache = require("../../lib/Cache");

const User = require("../models/User");

class CreateAppointmentService {
  async run({ provider_id, user_id, date }) {
    const isProvider = await User.findOne({
      where: { id: provider_id },
    });

    if (!isProvider) {
      throw new Error("user is not a provider");
    }

    const hourStart = startOfHour(parseISO(date));

    //check for past dates
    if (isBefore(hourStart, new Date())) {
      throw new Error("Past date is not permitted");
    }

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      throw new Error("Date is not available");
    }

    const appointment = await Appointment.create({
      user_id,
      provider_id,
      date: hourStart,
    });

    //notify appointment provider

    const { name } = await User.findByPk(user_id);
    const formattedDate = format(hourStart, "'dia' dd 'de' MMMM', às' H:mm", {
      locale: pt,
    });

    await Notification.create({
      content: `Novo agendamento de ${name} para o ${formattedDate}`,
      user: provider_id,
    });

    //Invalidate Cache

    await Cache.invalidatePrefix(`user:${user_id}:appointments`);

    return appointment;
  }
}

module.exports = new CreateAppointmentService();
