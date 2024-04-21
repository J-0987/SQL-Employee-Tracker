INSERT INTO department (name) VALUES
('Management'),
('Sales'),
('Engineering'),
('Finance'),
('Marketing'),
('Human Resources'),
('IT'),
('Operations');

INSERT INTO role (title, salary, department_id) VALUES
('Manager', 100000, 1),
('Sales Lead', 75000, 2),
('Salesperson', 50000, 3),
('Lead Engineer', 80000, 4),
('Marketing Manager', 90000, 5),
('HR Specialist', 60000, 6),
('IT Analyst', 70000, 7),
('Operations Manager', 95000, 8);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, 2),
('Jane', 'Smith', 2, 3),
('Alice', 'Williams', 3, 4),
('Steve', 'Brown', 4, 1),
('Michael', 'Johnson', 5, 6),
('Emily', 'Davis', 6, 7),
('David', 'Miller', 7, 8),
('Sarah', 'Anderson', 8, 5);

