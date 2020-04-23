const Yup = require("yup");

module.exports = async (req, res, next) => {
  try {
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
        ),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Validation fails", messages: error.inner });
  }
};
