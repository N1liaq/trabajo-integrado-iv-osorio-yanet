import { Sequelize } from "sequelize";

const sequelize = new Sequelize("movies", "root", "' '", {
  host: "localhost",
  dialect: "mysql",
});

export default sequelize;
