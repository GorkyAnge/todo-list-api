const { app, sequelize } = require("./app");

(async () => {
  await sequelize.sync();
  app.listen(3000, () => console.log("Server running on port 3000"));
})();
