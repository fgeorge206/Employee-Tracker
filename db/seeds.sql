INSERT INTO department (name)
VALUES ("Sales"),
("Enginering"),
("Customer Service");

INSERT INTO role (title, salary, department_id)
VALUES ("Regional Sales Manager", 120000.00, 01),
    ("Sales Manager", 80000.00, 01),
    ("Sales Rep", 60000.00, 01),
    ("Project Manager", 120000.00, 02),
    ("Senior Developer", 10000.00, 02),
    ("Junior Developer", 70000.00, 02),
    ("Customer Service Manager", 70000.00, 03),
    ("Customer Service Supervisor", 50000.00, 03),
    ("Customer Service Rep", 40000.00, 03);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 01, NULL),
    ("Mike", "Smith", 02, 01),
    ("Roger", "Smith", 03, 02),
    ("Benison", "Ten", 04, NULL),
    ("Sarah", "Tom", 05, 04),
    ("Tori", "Kelly", 06, 05),
    ("Jacob", "Gai", 07, NULL),
    ("Wilma", "Grace", 08, 07),
    ("Hai", "Henry", 09, 08);