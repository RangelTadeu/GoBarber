const User = require("../models/User");
const Yup = require("yup");

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: "Validation fails" });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: "User already exists." });
    }

    console.log(req.body);

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      oldPass: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when("oldPass", (oldPass, field) =>
          oldPass ? field.required() : field
        ),
      confirmPassword: Yup.string()
        .min(6)
        .when("password", (password, field) =>
          password ? field.required().oneOf([Yup.ref("password")]) : field
        )
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: "Validation fails" });
    }

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
      provider
    });
  }
}

module.exports = new UserController();
