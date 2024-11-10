const router = require("express").Router();

const userRoutes = require("./userRoutes");

const routes = [{ path: "/users", route: userRoutes }];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
