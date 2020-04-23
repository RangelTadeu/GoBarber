const User = require("../models/User");
const Cache = require("../../lib/Cache");

class UserController {
  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: "User already exists." });
    }

    console.log(req.body);

    const { id, name, email, provider } = await User.create(req.body);

    if (provider) {
      await Cache.invalidate("providers");
    }

    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    const { email, oldPass } = req.body;

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.send(404).json({ message: "User not found" });
    }

    if (email && user.email === email) {
      return res.send(401).json({ message: "Email already exist on database" });
    }

    if (oldPass && !(await user.checkPassword(oldPass))) {
      return res.status(401).json({ message: "Passwords does not match" });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.status(200).json({
      id,
      name,
      email,
      provider,
    });
  }
}

module.exports = new UserController();
