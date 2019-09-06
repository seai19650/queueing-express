const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'db',
  user: 'root',
  password: 'example',
  database: 'vescd'
})

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});