const { Router } = require("express");
const multer = require("multer");
const multerConfig = require("./config/multer");

const UserControlller = require("./app/controllers/UserController");
const SessionController = require("./app/controllers/SessionController");
const FileController = require("./app/controllers/FileController");
const ProviderController = require("./app/controllers/ProviderController");
const AppointmentController = require("./app/controllers/AppointmentController");
const ScheduleController = require("./app/controllers/ScheduleController");
const NotificationController = require("./app/controllers/NotificationController");
const AvailableController = require("./app/controllers/AvailableController");
const AuthMiddleware = require("./app/middlewares/auth");

const routes = new Router();

const upload = multer(multerConfig);

routes.post("/users", UserControlller.store);
routes.post("/sessions", SessionController.store);

routes.use(AuthMiddleware);

routes.put("/users", UserControlller.update);

routes.post("/files", upload.single("file"), FileController.store);

routes.get("/providers", ProviderController.index);
routes.get("/providers/:providerId/available", AvailableController.index);

routes.get("/appointments", AppointmentController.index);
routes.post("/appointments", AppointmentController.store);
routes.delete("/appointments/:id", AppointmentController.delete);

routes.get("/schedules", ScheduleController.index);

routes.get("/notifications", NotificationController.index);
routes.put("/notifications/:id", NotificationController.update);

module.exports = routes;
