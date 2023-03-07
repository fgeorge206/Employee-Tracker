INSERT INTO department(name)
VALUES ("Customer Service"),
    ("Sales"),
    ("Engineering"),
    ("Production");
INSERT INTO role(title, salary, department_id)
VALUES ("Customer Service Supervisor", 45000, 1),
    ("Customer Service Manager", 40000, 1),
    ("Customer Service Rep", 38200, 1),
    ("Regional Sales Manager", 60000,  2),
    ("Sales Rep", 57000, 2),
    ("Senior Developer", 120000, 3),
    ("Junior Developer", 90000, 3),
    ("Production Manager", 45000, 4),
    ("Production Technician", 40000, 4);
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL),
    ("Mike", "Chan", 2, 1),
    ("Roger", "Smith", 3, 2),
    ("Ben", "Ten", 3, 2),
    ("Sarah", "Sales", 4, NULL),
    ("Tori", "Reese", 5, 5),
    ("Stephanie", "Jobs", 6, NULL),
    ("Wilma", "Fence", 7, 7);