require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

console.log("**************************");

console.log(require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` }));

console.log("**************************");

console.log(process.env.DB_CONN_STRING);

module.exports = {
  development: {
    use_env_variable: "DB_CONN_STRING",
    dialect: "postgres",
  },
  production: {
    use_env_variable: "DB_CONN_STRING",
    dialect: "postgres",
  },
  test: {
    use_env_variable: "DB_CONN_STRING",
    dialect: "postgres",
  },
};
