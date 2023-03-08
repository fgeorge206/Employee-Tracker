const inquirer = require("inquirer")
const mysql = require("mysql2")

const db = mysql.createConnection(
	{
	  host: 'localhost',
	  user: 'root',
	  password: 'password',
	  database: 'employee_db'
	},
	console.log(`Connected to the employee_db database.`)
  );
  
function promptUser(){
	inquirer.prompt([
		{
			type: "list",
			name: "option",
			message: "What do you want to do?",
			choices: ["view all departments", "view all roles", "view all employees"]
		}
	]).then(function(results){
		console.log(results)
	})
}
db.connect(function(err){
	if (err) throw err;
	promptUser();
})