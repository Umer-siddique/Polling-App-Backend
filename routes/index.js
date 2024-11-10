const router = require("express").Router();

const userRoutes = require("./userRoutes");
const pollRoutes = require("./pollRoutes");

const routes = [
  { path: "/users", route: userRoutes },
  { path: "/polls", route: pollRoutes },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
