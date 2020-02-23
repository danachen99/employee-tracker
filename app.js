const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

// const departments = ["Sales", "Engineering", "Finance", "Legal"];
// const roles = ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead"];

const departments = []
const roles = [];

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
    runSearch();
});

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
                "View All Employees By Manager",
                "Add Employee",
                "Remove Employee",
                "Update Employee Role",
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
//id, first, last, title, department, salary, manager
const viewEmployees = () => {
    const query = "SELECT * FROM employee";
    connection.query(query, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            console.log(`${res[i].id}. ${res[i].first_name} ${res[i].last_name} | Role: Manager`);
        }
        runSearch();
    })
}

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

//view by department, shows only first name, last name, and role 
const viewByDepartment = () => {
    inquirer
        .prompt({
            name: "department",
            type: "rawlist",
            message: "Which department would you like to view?",
            choices: departments
        }).then((res) => {
            const query = "SELECT employee.first_name, employee.last_name, employee_role.title FROM employee_role JOIN employee ON employee_role.id = employee.role_id WHERE employee_role.title = ?;"
            connection.query(query, [res.department], (err, res) => {
                for (let i = 0; i < res.length; i++) {
                    console.log(`${res[i].title} | ${res[i].first_name} ${res[i].last_name}`);
                }
            });
            runSearch();
        });
}

//bonus
const viewByManager = () => {

}

//
const addEmployee = () => {
    inquirer
        .prompt({
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
            choices: roles
        }, {
            type: "input",
            name: "last_name",
            message: "Who is the employee's manager?",
            choices: ["", "None"]
        }).then(res => {
            const query = ""
        });
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

const updateRole = () => {
    inquirer.prompt({
        type: "input",
        name: "id",
        message: "Which employee's role would you like to update by ID?"
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