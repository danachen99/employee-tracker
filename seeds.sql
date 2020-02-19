INSERT INTO department (name)
VALUES ("Engineering"),("Sales"), ("Finance"), ("Human Resources");

INSERT INTO employee_role (title, salary, department_id)
VALUES ("Engineering", 75000, 1), ("Sales", 40000, 2), 
("Finance", 50000, 3), ("Human Resources", 48000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Emily","Rhodes", 2, 5); 

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Christina","Park", 3), ("Andy","Perkins", 2);
