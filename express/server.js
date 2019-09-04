const express = require('express')
const mysql = require('mysql')
const app = express()

const connection = mysql.createConnection({
  host: 'db',
  user: 'root',
  password: 'example',
  database: 'vescd'
})

app.listen(3000, () => {
    console.log('My Rest API running on port 3000!');
} )