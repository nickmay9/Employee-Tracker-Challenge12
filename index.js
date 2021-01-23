const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table'); 

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'aaaaaa',
    database: 'company_employeesDB'
});

connection.connect(err => {
    if(err) throw err;
    console.log('connected as id ' + connection.threadId);
    connection.end();
});

