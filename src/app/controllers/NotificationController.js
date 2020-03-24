const Notification = require("../schemas/notification");
const User = require("../models/User");

class NotificationController {
  async index(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId }
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: "Only providers can load notifications" });
    }

    const notifications = await Notification.find({
      user: req.userId
    })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

module.exports = new NotificationController();
