-- Initial departments
INSERT INTO department (name)
VALUES ("Engineering"),("Sales"), ("Finance"), ("Legal");

-- Initial Roles 
INSERT INTO employee_role (title, salary, department_id)
VALUES ("Lead Engineer", 90000, 1), ("Software Engineer", 85000, 1),
("Sales Lead", 45000, 2), ("Salesperson", 40000, 2),
("Accountant", 50000, 3), ("Account Manager", 55000, 3), 
("Legal Team Lead", 60000, 4);

-- Initial Employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Emily","Rhodes", 2, 2),
("Christina","Park", 1, NULL), 
("Andy","Perkins", 2, 2),
("James","Farrugia",6, NULL),
("Mike","Campbell",5,4);
