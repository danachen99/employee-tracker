const mysql = require("mysql");
const inquirer = require("inquirer");

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
const viewEmployees = () => {
    const query = "SELECT * FROM employee";
    connection.query(query, (err, res) => {
        for (let i = 0; i < res.length; i++) {
            console.log(`${res[i].id}. ${res[i].first_name} ${res[i].last_name} | Role: Manager`);
        }
        runSearch();
    })
}


const viewByDepartment = () => {
    inquirer
        .prompt({
            name: "department",
            type: "rawlist",
            message: "Which department would you like to view?",
            choices: ["Sales", "Engineering", "Finance", "Legal"]
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