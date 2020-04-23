const { Router } = require("express");
const multer = require("multer");
const multerConfig = require("./config/multer");
const Brute = require("express-brute");
const BruteRedis = require("express-brute-redis");
const redisConfig = require("./config/redis");

const UserControlller = require("./app/controllers/UserController");
const SessionController = require("./app/controllers/SessionController");
const FileController = require("./app/controllers/FileController");
const ProviderController = require("./app/controllers/ProviderController");
const AppointmentController = require("./app/controllers/AppointmentController");
const ScheduleController = require("./app/controllers/ScheduleController");
const NotificationController = require("./app/controllers/NotificationController");
const AvailableController = require("./app/controllers/AvailableController");
const AuthMiddleware = require("./app/middlewares/auth");

const validadeUserStore = require("./app/validators/UserStore");
const validadeUserUpdate = require("./app/validators/UserUpdate");
const validadeAppointmentStore = require("./app/validators/AppointmentStore");

const routes = new Router();

const upload = multer(multerConfig);

const bruteStore = new BruteRedis(redisConfig);

const bruteForce = new Brute(bruteStore);

routes.post("/users", validadeUserStore, UserControlller.store);
routes.post("/sessions", bruteForce.prevent, SessionController.store);

routes.use(AuthMiddleware);

routes.put("/users", validadeUserUpdate, UserControlller.update);

routes.post("/files", upload.single("file"), FileController.store);

routes.get("/providers", ProviderController.index);
routes.get("/providers/:providerId/available", AvailableController.index);

routes.get("/appointments", AppointmentController.index);
routes.post(
  "/appointments",
  validadeAppointmentStore,
  AppointmentController.store
);
routes.delete("/appointments/:id", AppointmentController.delete);

routes.get("/schedules", ScheduleController.index);

routes.get("/notifications", NotificationController.index);
routes.put("/notifications/:id", NotificationController.update);

module.exports = routes;
