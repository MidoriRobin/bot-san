const Sequelize = require("sequelize");
const dotenv = require("dotenv");

//Loads data from .env files into process.env variable
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_UNAME,
  process.env.DB_PASS,
  {
    host: "localhost",
    dialect: "postgres",
    logging: false,
  }
);

require("./models/Users")(sequelize, Sequelize.DataTypes);
require("./models/Match")(sequelize, Sequelize.DataTypes);
require("./models/Wins")(sequelize, Sequelize.DataTypes);
require("./models/Losses")(sequelize, Sequelize.DataTypes);
require("./models/Result")(sequelize, Sequelize.DataTypes);

const force = process.argv.includes("--force") || process.argv.includes("-f");

sequelize
  .sync({ force })
  .then(async () => {
    console.log("Database synced");
    sequelize.close();
  })
  .catch(console.error);
