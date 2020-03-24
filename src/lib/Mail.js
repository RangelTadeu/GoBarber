const nodemailer = require("nodemailer");
const { resolve } = require("path");
const mailConfig = require("../config/mail");
const exphbs = require("express-handlebars");
const nodemailerhbs = require("nodemailer-express-handlebars");

class Mail {
  constructor() {
    const { host, port, secure, auth, rejectUnauthorized } = mailConfig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth,
      rejectUnauthorized
    });

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, "..", "app", "views", "emails");

    this.transporter.use(
      "compile",
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, "layouts"),
          partialsDir: resolve(viewPath, "partials"),
          defaultLayout: "default",
          extname: ".hbs"
        }),
        viewPath,
        extName: ".hbs"
      })
    );
  }

  sendMail(message) {
    const { default_ } = mailConfig;

    return this.transporter.sendMail({
      ...message,
      ...default_
    });
  }
}

module.exports = new Mail();
