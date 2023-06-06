const mysql = require("mysql")

var connection = mysql.createConnection({
    host     : 'database-1.cbtm110bpuby.eu-north-1.rds.amazonaws.com',
    user     : 'admin',
    password : 'Ce99me05',
    database : 'allheredb'
  });
   
  connection.connect(function(err){
    if(err) throw err;
    console.log("connected!")
  });

  module.exports = connection;