//Here you will import route files and export the constructor method as shown in lecture code and worked in previous labs.
// import apiRoutes from "./api_routes.js";
// import favoriteRoutes from "./favorite_routes.js";
import userRoutes from "./user_routes";
import stationRoutes from "./station_routes";

const constructorMethod = (app) => {
  // app.use("/api", apiRoutes);
  // app.use("/favorites", favoriteRoute);
  app.use("/user", userRoutes);
  app.use("/station", stationRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "No Valid Route" });
  });
};

export default constructorMethod;
