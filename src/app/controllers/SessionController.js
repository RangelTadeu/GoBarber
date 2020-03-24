const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authConfig = require("../../config/auth");

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!(await user.checkPassword(password, user.password_hash))) {
      return res.status(401).json({ message: "Passwords does not match" });
    }

    const { id, name } = user;

    return res.status(200).json({
      user: { id, name, email },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    });
  }
}

module.exports = new SessionController();
