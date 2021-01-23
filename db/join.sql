SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, employee.manager_id
FROM employee
INNER JOIN roles ON employee.role_id = roles.id
INNER JOIN department ON roles.department_id = department.id
ORDER BY employee.id;

SELECT e.first_name, e.last_name, CONCAT(m.first_name, ' ', m.last_name) AS manager, e.manager_id
FROM employee e, employee m
WHERE e.manager_id = m.id;

SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM employee m, employee
INNER JOIN roles ON employee.role_id = roles.id
INNER JOIN department ON roles.department_id = department.id
WHERE employee.manager_id = m.id
ORDER BY employee.id;

SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, employee.manager_id AS manager
FROM employee
INNER JOIN roles ON employee.role_id = roles.id
INNER JOIN department ON roles.department_id = department.id
ORDER BY employee.id;