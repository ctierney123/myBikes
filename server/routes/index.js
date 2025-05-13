//Here you will import route files and export the constructor method as shown in lecture code and worked in previous labs.
import userRoutes from "./user_routes.js";
import stationRoutes from "./station_routes.js";
import favoriteRoutes from "./favorite_routes.js";
import testRoutes from "./test_routes.js";
import elastic_routes from "./elastic_routes.js";

const constructorMethod = (app) => {
  app.use("/users", userRoutes);
  app.use("/stations", stationRoutes);
  app.use("/api", elastic_routes);
  // app.use("/favorites", favoriteRoutes);
  app.use("/test", testRoutes);
  app.use("/{*any}", (req, res) => {
    res.status(404).json({ error: "No Valid Route" });
  });
};

export default constructorMethod;
