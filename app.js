const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

let employees = [];
let employeeNames = [];
let departments = [];
let departmentNames = [];
let roles = [];
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

//will populate all arrays with objects from the tables to be accessed later
const init = () => {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            employees.push(res[i]);
        }
        // console.log(employees);

    });

    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            departments.push(res[i]);
        }
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
                "View All Employees By Manager",
                "Remove Employee",
                "Update Employee Manager"
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
                case "View All Employees By Manager":
                    viewByManager();
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
                case "Remove Employee":
                    removeEmployee();
                    break;
                case "Update Employee Role":
                    updateRole();
                    break;
                case "Update Employee Manager":
                    updateManager();
                    break;
            }
        })
}

//view all employees... join employee and employee role tables
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
            }
            // {
            //     type: "input",
            //     name: "last_name",
            //     message: "Who is the employee's manager ID?"
            //         // default: null
            // }
        ]).then(res => {
            // const query = "INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)";
            // connection.query(query, [res.first_name, res.last_name, res.title], (err, res) => {
            //     if (err) throw err;
            //     console.log(`Your employee has been added! ${res.first_name} ${res.last_name} ${res.title}`);
            //     // console.table(res);
            // });
            const roleID = roleTitles.indexOf(res.title) + 1;
            console.log(roleID)
            connection.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES ("${res.first_name}", "${res.last_name}", ${roleID})`, (err, res) => {
                if (err) throw err;
                console.log(`Your employee has been added! ${res.first_name} ${res.last_name} ${res.title}`);
                // console.table(res);
            });
            init();
        });
}

const addDepartment = () => {

}


const updateRole = () => {
    inquirer.prompt({
        type: "rawlist",
        name: "id",
        message: "Which employee's role would you like to update by ID?",
        choices: employees
    }, {
        type: "rawlist",
        name: "update",
        message: "What would you like to update their role to?",
        choices: roles
    }).then(res => {
        let roleIndex;
        switch (res.update) {
            case "Sales Lead":
                roleIndex = 0;
                break;
            case "Salesperson":
                roleIndex = 1;
                break;
            case "Lead Engineer":
                roleIndex = 2;
                break;
            case "Software Engineer":
                roleIndex = 3;
                break;
            case "Account Manager":
                roleIndex = 4;
                break;
            case "Accountant":
                roleIndex = 5;
                break;
            case "Legal Team Lead":
                roleIndex = 6;
                break;
        }
        const query = "UPDATE employee SET ? WHERE ?;"
        connection.query(query, [roleIndex, res.id], (err, res) => {
            console.log(`The employee of ID ${res.id}'s role has been updated to ${res.update}`)
        });
        runSearch();
    });
}

//bonus
const updateManager = () => {

}

//bonus
const removeEmployee = () => {
        inquirer.prompt({
            type: "input",
            name: "delete",
            message: "Which employee would you like to remove?"
        }).then(res => {

        });
    }
    //bonus
const viewByManager = () => {

}