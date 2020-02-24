const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

//arrays of objects from SQL queries  
let employees = [];
let departments = [];
let roles = [];

//will contain specific values from one key that will be used for user prompts
let employeeNames = [];
let departmentNames = [];
let roleTitles = [];

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "yourRootPassword",
    database: "cms_db"
});

//create connection and call the first inquirer function
connection.connect((err) => {
    if (err) throw err;
    init();
});

//populate all arrays with objects from the tables to be accessed later
const init = () => {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            employees.push(res[i]);
        }
        // console.log(employees);
        employees.forEach((employee) => employeeNames.push(employee.first_name));
    });

    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            departments.push(res[i]);
        }
        departments.forEach((department) => departmentNames.push(department.name));
    });

    connection.query("SELECT * FROM employee_role", (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            roles.push(res[i]);
        }
        // roles.forEach((role) => console.log(`${role.title}`));
        roles.forEach((role) => roleTitles.push(role.title));

    });

    runSearch();
}

//contains all prompts for the user with switch cases
const runSearch = () => {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: ["View All Employees",
                "View All Departments",
                "View All Positions",
                "View All Employees By Department",
                "Add Employee",
                "Add Department",
                "Add Role/Position",
                "Update Employee Role",
                "Exit"
            ]
        })
        .then((res) => {
            switch (res.action) {
                case "View All Employees":
                    viewEmployees();
                    break;
                case "View All Departments":
                    viewDepartments();
                    break;
                case "View All Positions":
                    viewPositions();
                    break;
                case "View All Employees By Department":
                    viewByDepartment();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Add Role/Position":
                    addRole();
                    break;
                case "Update Employee Role":
                    updateRole();
                    break;
                case "Update Employee Role":
                    connection.end();
                    console.log("Goodbye")
                    return;
            }
        })
}

//view all employees
const viewEmployees = () => {
    const query = "SELECT employee.*, employee_role.title FROM employee JOIN employee_role ON employee.role_id = employee_role.id";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table("\n", res);
    });
    runSearch();
}

//view ALL departments
const viewDepartments = () => {
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table("\n", res);
    });
    runSearch();
}

//view ALL positions
const viewPositions = () => {
    const query = "SELECT * FROM employee_role";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table("\n", res);
    });
    runSearch();
}


//view EMPLOYEES by their department
const viewByDepartment = () => {
    inquirer
        .prompt({
            name: "department",
            type: "rawlist",
            message: "Which department would you like to view?",
            choices: departments
        }).then((res) => {
            const query = "SELECT department.name AS department, employee.first_name, employee.last_name, employee_role.title FROM employee_role JOIN employee ON employee_role.id = employee.role_id JOIN department ON department.id = employee_role.department_id WHERE department.name = ?;"
            connection.query(query, [res.department], (err, res) => {
                console.table("\n", res);
            });
            runSearch();
        });
}


//add employee
const addEmployee = () => {
    inquirer
        .prompt([{
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?"
        }, {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?"
        }, {
            type: "rawlist",
            name: "title",
            message: "What is the employee's role title?",
            choices: roleTitles
        }, {
            type: "confirm",
            name: "manager",
            message: "Does this employee have a manager?"
        }]).then(res => {
            const roleID = roleTitles.indexOf(res.title) + 1;
            if (res.manager) {
                addEmployeeWithManager(res, roleID);
            } else {
                connection.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES ("${res.first_name}", "${res.last_name}", ${roleID})`, (err, res) => {
                    if (err) throw err;
                    console.log(`Your employee has been added!`);
                });
            }
            // init();
        });
}

//prompt user for manager during adding 
const addEmployeeWithManager = (res, roleID) => {
    inquirer
        .prompt({
            type: "rawlist",
            name: "manager_id",
            message: "Who is the manager?",
            choices: employeeNames
        }).then(result => {
            let employeeID = employeeNames.indexOf(result.manager_id) + 1;
            connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${res.first_name}", "${res.last_name}", ${roleID}, ${employeeID})`, (err, res) => {
                if (err) throw err;
                console.log(`Your employee has been added!`);
            });
        });
}

//add department
const addDepartment = () => {
    inquirer
        .prompt({
            type: "input",
            name: "name",
            message: "What is the name of the new department?"
        }).then(res => {
            const query = `INSERT INTO department (name) VALUES (?)`;
            connection.query(query, [res.name], (err, res) => {
                if (err) throw err;
                console.log("Your new department has been sucessfully added!")
            });
            init();
        });
}

//add role by selecting which department to add to first
const addRole = () => {
    inquirer
        .prompt([{
            type: "rawlist",
            name: "department",
            message: "Which department would you like to add to?",
            choices: departmentNames
        }, {
            type: "input",
            name: "title",
            message: "What is the title of the new role/position?"
        }, {
            type: "input",
            name: "salary",
            message: "What is the salary for this position?"
        }]).then(res => {
            const departmentID = departmentNames.indexOf(res.department) + 1;
            const query = `INSERT INTO employee_role (title, salary, department_id) VALUES (?,?,?)`;
            connection.query(query, [res.title, res.salary, departmentID], (err, res) => {
                if (err) throw err;
                console.log("The new position has been sucessfully added!")
            });
            init();
        });
}

//update an employee's role/title by selecting from list of employees
const updateRole = () => {
    inquirer.prompt([{
        type: "rawlist",
        name: "name",
        message: "Which employee's role would you like to update?",
        choices: employeeNames
    }, {
        type: "rawlist",
        name: "title",
        message: "What would you like to update their role to?",
        choices: roleTitles
    }]).then(res => {
        const roleID = roleTitles.indexOf(res.title) + 1;
        const query = "UPDATE employee SET role_id = ? WHERE first_name = ?;"
        connection.query(query, [roleID, res.name], (err, res) => {
            if (err) throw err;
            console.log(`The employee's role has been updated!`)
        });
        init();
    });
}