INSERT INTO department (name)
VALUES
    ('Engineering'),
    ('Sales'),
    ('Human Resources'),
    ('Finance');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Software Engineer', 120000, 1),
    ('Hardware Engineer', 110000, 1),
    ('Quality Engineer', 80000, 1),
    ('Lead Engineer', 150000, 1),
    ('Business Development', 80000, 2),
    ('Account Executive', 90000, 2),
    ('Sales Lead', 100000, 2),
    ('HR Associate', 45000, 3),
    ('HR Senior', 65000, 3),
    ('HR Lead', 75000, 3),
    ('Accountant', 80000, 4),
    ('Financial Analyst', 80000, 4),
    ('Finance Lead', 100000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Chris', 'Lloyd', 4, NULL),
    ('Jason', 'Smith', 1, 1),
    ('Mike', 'Jones', 2, 1),
    ('Kyle', 'Little', 3, 1),
    ('Joel', 'Weber', 7, NULL),
    ('Greg', 'Buffalo', 5, 5),
    ('Bob', 'Wells', 6, 5),
    ('Laura', 'Eyenon', 10, NULL),
    ('John', 'Davison', 8, 8),
    ('Allen', 'Smith', 9, 8),
    ('Nick', 'May', 13, NULL),
    ('Lauren', 'Grace', 11, 11),
    ('Bradley', 'Eyenon', 12, 11);