const dotenv = require('dotenv').config()

module.exports = {
  "development": {
    "username": "root",
    "password": "example",
    "database": "vescd",
    "host": "db",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "db",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "db",
    "dialect": "mysql"
  }
}
