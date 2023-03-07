// Import inquirer, mysql and console.table.
const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");

let departments = [];
let deptNames = [];
let roles = [];
let roleTitles = [];
let employees = [];
let employeeNames = [];

const db = mysql.createConnection(
	{
		host: "localhost",
		user: "root",
		password: "password",
		database: "company_db",
	},
	console.log("Connected to the company_db database.")
);

const menuOptions = [
	"View All Departments",
	"View All Roles",
	"View All Employees",
	"Add Department",
	"Add Role",
	"Add Employee",
	"Update an Employee Role",
	"Update an Employee's Manager",
	"Quit",
];


function companyViewer() {
	inquirer
		.prompt([
			{
				type: "list",
				message: "Select one of the following options:",
				name: "menu",
				choices: menuOptions,
			},
		])
		.then((res) => {
			switch (res.menu) {
				case menuOptions[0]:
					const department = `SELECT * FROM department`;
					viewAll(department);
					break;
				case menuOptions[1]:
					const role = `SELECT role.id, title, department.name, salary 
						FROM role 
						JOIN department ON department_id = department.id`;
					viewAll(role);
					break;
				case menuOptions[2]:
					const employee = `SELECT e.id, e.first_name, e.last_name, role.title, department.name as department, role.salary, CONCAT(m.first_name," ", m.last_name) AS manager
					FROM employee e
					LEFT JOIN employee m ON e.manager_id = m.id
					JOIN role ON e.role_id = role.id
					JOIN department ON role.department_id = department.id;`;
					viewAll(employee);
					break;
				case menuOptions[3]:
					addDept();
					break;
				case menuOptions[4]:
					addRole();
					break;
				case menuOptions[5]:
					addEmployee();
					break;
				case menuOptions[6]:
					updateRole();
					break;
				case menuOptions[7]:
					updateManager();
					break;
				default:
					console.log("Exiting.");
					process.exit();
			}
		});
}

function viewAll(sql) {
	db.promise()
		.query(sql)
		.then(([rows,]) => {
			console.table(rows);
		})
		.catch((err) => {
			console.log(err);
		})
		.then(() => {
			companyViewer();
		});
}

function addDept() {
	inquirer
		.prompt({
			type: "input",
			message: "Please enter the name of the department.",
			name: "department",
		})
		.then((res) => {
			db.promise()
				.query(`INSERT INTO department (name) VALUES (?)`, res.department)
				.then(() => {
					console.log(`${res.department} has been added to the database.`);
					queryDept();
					companyViewer();
				})
				.catch((err) => {
					console.log(err);
				});
		})
		.catch((err) => {
			throw err;
		});
}

function addRole() {
	inquirer
		.prompt([
			{
				type: "input",
				message: "Please enter the title of the role.",
				name: "title",
			},
			{
				type: "input",
				message: "Please enter the salary of the role.",
				name: "salary",
			},
			{
				type: "list",
				message: "Select one of the following departments:",
				name: "department",
				choices: deptNames,
			},
		])
		.then((res) => {
			var deptId = departments.find(({ name }) => name == `${res.department}`).id;
			db.query(`INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`, [
				res.title,
				res.salary,
				deptId,
			]);
			console.log(`${res.title} added as a new role.`);
			queryRole();
			companyViewer();
		})
		.catch((err) => {
			throw err;
		});
}

function addEmployee() {
	inquirer
		.prompt([
			{
				type: "input",
				message: "Please enter the employee's first name.",
				name: "first_name",
			},
			{
				type: "input",
				message: "Please enter the employee's last name.",
				name: "last_name",
			},
			{
				type: "list",
				message: "What is the employee's role?",
				name: "role",
				choices: roleTitles,
			},
			{
				type: "confirm",
				message: "Does this employee have a manager?",
				name: "manaCheck",
			},
			{
				type: "list",
				message: "Who is this employee's manager?",
				name: "manager",
				choices: employeeNames,
				when(answer) {
					return answer.manaCheck;
				},
			},
		])
		.then((res) => {
			var roleId = roles.find(({ title }) => title == `${res.role}`).id;
			var manId;
			if (res.manaCheck) {
				manId = employees.find(({ employee }) => employee == `${res.manager}`).id;
			} else {
				manId = null;
			}
			db.query(
				`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,
				[res.first_name, res.last_name, roleId, manId]
			);
			console.log(`${res.first_name} ${res.last_name} has been added to the database.`);
			queryEmployee();
			companyViewer();
		})
		.catch((err) => {
			throw err;
		});
}

function updateRole() {
	inquirer
		.prompt([
			{
				type: "list",
				message: "Which employee would you like to update?",
				name: "employee",
				choices: employeeNames,
			},
			{
				type: "list",
				message: "Please select a new role for the employee.",
				name: "role",
				choices: roleTitles,
			},
		])
		.then((res) => {
			var empId = employees.find(({ employee }) => employee == `${res.employee}`).id;
			var roleId = roles.find(({ title }) => title == `${res.role}`).id;
			db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [roleId, empId]);
			queryEmployee();
			companyViewer();
		})
		.catch((err) => {
			throw err;
		});
}

function updateManager() {
	inquirer
		.prompt([
			{
				type: "list",
				message: "Which employee would you like to update their assigned manager?",
				name: "employee",
				choices: employeeNames,
			},
			{
				type: "confirm",
				message: "Does this employee have a manager?",
				name: "manaCheck",
			},
			{
				type: "list",
				message: "Who is the employee'smanager?",
				name: "manager",
				choices: employeeNames,
				when(answer) {
					return answer.manaCheck;
				},
			},
		])
		.then((res) => {
			var empId = employees.find(({ employee }) => employee == `${res.employee}`).id;
			var manId;
			if (res.manaCheck) {
				manId = employees.find(({ employee }) => employee == `${res.manager}`).id;
			} else {
				manId = null;
			}
			db.query(`UPDATE employee SET manager_id = ? WHERE id = ?`, [manId, empId]);
			queryEmployee();
			companyViewer();
		})
		.catch((err) => {
			throw err;
		});
}

function queryDept() {
	departments = [];
	deptNames = [];
	db.promise()
		.query(`SELECT * FROM department`)
		.then(([res,]) => {
			res.forEach((department) => {
				let depObj = {
					id: department.id,
					name: department.name,
				};
				departments.push(depObj);
				deptNames.push(department.name);
			});
		})
		.catch((err) => {
			throw err;
		});
}

function queryRole() {
	roles = [];
	roleTitles = [];
	db.promise()
		.query(`SELECT id, title FROM role`)
		.then(([res,]) => {
			res.forEach((role) => {
				let roleObj = {
					id: role.id,
					title: role.title,
				};
				roles.push(roleObj);
				roleTitles.push(role.title);
			});
		})
		.catch((err) => {
			throw err;
		});
}

function queryEmployee() {
	employees = [];
	employeeNames = [];
	db.promise()
		.query(`SELECT id, CONCAT(first_name, " ", last_name) AS employee FROM employee`)
		.then(([res]) => {
			res.forEach((employee) => {
				let empObj = {
					id: employee.id,
					employee: employee.employee,
				};
				employees.push(empObj);
				employeeNames.push(employee.employee);
			});
		})
		.catch((err) => {
			throw err;
		});
}

function init() {
	queryDept();
	queryRole();
	queryEmployee();
	companyViewer();
}

init();