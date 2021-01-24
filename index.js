const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const rolesArr = []; //list choices for roles
const managerArr = []; //list choices for managers
const employeesArr = []; //list choices for employee
const departmentArr = []; //list choices for department

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'aaaaaa',
    database: 'company_employeesDB'
});

connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);

    startCompany();
});

const startCompany = () => {
    //query for roles list
    connection.query(`SELECT roles.title, roles.id FROM roles`, function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            let x = {
                name: res[i].title,
                id: res[i].id
            };
            rolesArr.push(x);
        }
    });

    //query for managers list
    connection.query(`SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS name, employee.manager_id FROM employee`, function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            if (res[i].manager_id === null) {
                let x = {
                    name: res[i].name,
                    id: res[i].id
                };
                managerArr.push(x);
            }
        }

    });

    //query for employees list
    connection.query(`SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS name FROM employee`, function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            let x = {
                name: res[i].name,
                id: res[i].id
            };
            employeesArr.push(x);

        }

    });

    //query for department list
    connection.query(`SELECT department.id, department.name FROM department`, function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            let x = {
                name: res[i].name,
                id: res[i].id
            };
            departmentArr.push(x);

        }

    });

    const startPrompt = [
        {
            type: 'list',
            name: 'toDo',
            message: 'What would you like to do?',
            choices: [
                'View all Employees',
                'View all Roles',
                'View all Departments',
                'Add an Employee',
                'Update an Employee',
                'Update an Employee Manager',
                'Delete an Employee',
                'Add a Role',
                'Delete a Role',
                'Add a Department',
                'Delete a Department',
                'View Departments Budget',
                'Exit'
            ]
        }
    ];

    inquirer.prompt(startPrompt)
        .then(answer => {
            switch (answer.toDo) {
                case 'View all Employees':
                    viewEmployees();
                    break;
                case 'View all Roles':
                    viewRoles();
                    break;
                case 'View all Departments':
                    viewDepartments();
                    break;
                case 'Add an Employee':
                    addEmployee();
                    break;
                case 'Update an Employee':
                    updateEmployee();
                    break;
                case 'Update an Employee Manager':
                    updateEmployeeManager();
                    break;
                case 'Delete an Employee':
                    deleteEmployee();
                    break;
                case 'Add a Role':
                    addRole();
                    break;
                case 'Delete a Role':
                    deleteRole();
                    break;
                case 'Add a Department':
                    addDepartment();
                    break;
                case 'Delete a Department':
                    deleteDepartment();
                    break;
                case 'View Departments Budget':
                    viewDepartmentBudget();
                    break;
                case 'Exit':
                    connection.end();
                    console.log('Good Bye!');
                    return;
            }
        })
}

const viewEmployees = () => {

    const viewEmployeePrompt = [
        {
            type: 'list',
            name: 'order',
            message: "How would you like to view the employees?",
            choices: [
                'by department',
                'by manager',
                'default'
            ]
        }
    ];

    inquirer.prompt(viewEmployeePrompt)
    .then(answers => {
        let sql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, employee.manager_id
        FROM employee
        INNER JOIN roles ON employee.role_id = roles.id
        INNER JOIN department ON roles.department_id = department.id
        ORDER BY `;

        let params = '';
        switch (answers.order){
            case 'by department':
                params = 'department.name';
                break;
            case 'by manager':
                params = 'employee.manager_id';
                break;
            default:
                params = 'employee.id';
                break;
        }

        sql += params;

        connection.query(sql, function (err, res) {
            if (err) throw err;
            console.table('Employee Table', res);
            startCompany();
        });
    })
    
}

const viewRoles = () => {
    const sql = `SELECT roles.title, roles.salary, department.name
    FROM roles
    INNER JOIN department ON roles.department_id = department.id`;

    connection.query(sql, function (err, res) {
        if (err) throw err;
        console.table('Roles Table', res);
        startCompany();
    });
}

const viewDepartments = () => {
    const sql = `SELECT * FROM department`;

    connection.query(sql, function (err, res) {
        if (err) throw err;
        console.table('Department Table', res);
        startCompany();
    });
}

const addEmployee = () => {

    const addEmployeePrompt = [
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?"
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?"
        },
        {
            type: 'list',
            name: 'role',
            message: "What is the employee's role?",
            choices: rolesArr
        },
        {
            type: 'list',
            name: 'manager',
            message: "Who is the employee's manager?",
            choices: managerArr
        }
    ];

    inquirer.prompt(addEmployeePrompt)
        .then(answers => {
            let index = rolesArr.map(function (x) { return x.name; }).indexOf(answers.role);
            const roleNum = rolesArr[index].id;

            index = managerArr.map(function (x) { return x.name; }).indexOf(answers.manager);
            const managerNum = managerArr[index].id;

            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUES
                        ('${answers.firstName}', '${answers.lastName}', ${roleNum}, ${managerNum})`;

            connection.query(sql, function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + ' employee added!');
                startCompany();
            });
        });
}

const updateEmployee = () => {

    const updateEmployeePrompt = [
        {
            type: 'list',
            name: 'employee',
            message: 'Which employee would you like to update?',
            choices: employeesArr
        },
        {
            type: 'list',
            name: 'updateRole',
            message: "What is the employee's new role?",
            choices: rolesArr
        }
    ];

    inquirer.prompt(updateEmployeePrompt)
        .then(answers => {
            let index = employeesArr.map(function (x) { return x.name; }).indexOf(answers.employee);
            const employeeNum = employeesArr[index].id;

            index = rolesArr.map(function (x) { return x.name; }).indexOf(answers.updateRole);
            const roleNum = rolesArr[index].id;

            const sql = `UPDATE employee SET role_id = ${roleNum} WHERE id = ${employeeNum}`;

            connection.query(sql, function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + ' employee updated!');
                startCompany();
            });
        });

}

const updateEmployeeManager = () => {
    const updateEmployeeManagerPrompt = [
        {
            type: 'list',
            name: 'employee',
            message: 'Which employee would you like to update to a new manager?',
            choices: employeesArr
        },
        {
            type: 'list',
            name: 'manager',
            message: "Who is the employee's new manager?",
            choices: managerArr
        }
    ];

    inquirer.prompt(updateEmployeeManagerPrompt)
        .then(answers => {
            let index = employeesArr.map(function (x) { return x.name; }).indexOf(answers.employee);
            const employeeNum = rolesArr[index].id;

            index = managerArr.map(function (x) { return x.name; }).indexOf(answers.manager);
            const managerNum = managerArr[index].id;

            const sql = `UPDATE employee SET manager_id = ${managerNum} WHERE id = ${employeeNum}`;

            connection.query(sql, function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + ' employee manager updated!');
                startCompany();
            });
        });
}

const deleteEmployee = () => {
    const deleteEmployeePrompt = [
        {
            type: 'list',
            name: 'employee',
            message: 'Which employee would you like to remove?',
            choices: employeesArr
        }
    ];

    inquirer.prompt(deleteEmployeePrompt)
        .then(answers => {
            let index = employeesArr.map(function (x) { return x.name; }).indexOf(answers.employee);
            const employeeNum = employeesArr[index].id;

            const sql = `DELETE FROM employee WHERE id = ${employeeNum}`;

            connection.query(sql, function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + ' employee removed!');
                startCompany();
            });
        });


}

const addRole = () => {
    const addRolePrompt = [
        {
            type: 'input',
            name: 'roleName',
            message: 'What is the name of the new role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: "What is the role's salary?"
        },
        {
            type: 'list',
            name: 'department',
            message: 'What department is the role in?',
            choices: departmentArr
        }
    ];

    inquirer.prompt(addRolePrompt)
        .then(answers => {
            let index = departmentArr.map(function (x) { return x.name; }).indexOf(answers.department);
            const depNum = departmentArr[index].id;

            const sql = `INSERT INTO roles (title, salary, department_id)
                            VALUES
                        ('${answers.roleName}', ${answers.salary}, ${depNum})`;

            connection.query(sql, function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + ' role added!');
                startCompany();
            });

        });
}

const deleteRole = () => {
    const deleteRolePrompt = [
        {
            type: 'list',
            name: 'role',
            message: "What is the role you want to remove?",
            choices: rolesArr
        },
    ];

    inquirer.prompt(deleteRolePrompt)
        .then(answers => {
            let index = rolesArr.map(function (x) { return x.name; }).indexOf(answers.role);
            const roleNum = rolesArr[index].id;

            const sql = `DELETE FROM roles WHERE id = ${roleNum}`;

            connection.query(sql, function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + ' role removed!');
                startCompany();
            });
        });

}

const addDepartment = () => {

    const addDepartmentPrompt = [
        {
            type: 'input',
            name: 'depName',
            message: 'What is the department name?'
        }
    ];

    inquirer.prompt(addDepartmentPrompt)
        .then(answers => {
            const sql = `INSERT INTO department (name)
                        VALUES
                        ('${answers.depName}')`;

            connection.query(sql, function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + ' department added!');
                startCompany();
            });
        });

}

const deleteDepartment = () => {
    const deleteRolePrompt = [
        {
            type: 'list',
            name: 'department',
            message: 'What department do you want to remove?',
            choices: departmentArr
        }
    ];

    inquirer.prompt(deleteRolePrompt)
        .then(answers => {
            let index = departmentArr.map(function (x) { return x.name; }).indexOf(answers.department);
            const depNum = departmentArr[index].id;

            const sql = `DELETE FROM department WHERE id = ${depNum}`;

            connection.query(sql, function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + ' department removed!');
                startCompany();
            });
        });
}

const viewDepartmentBudget = () => {
    const viewDepartmentBudgetPrompt = [
        {
            type: 'list',
            name: 'department',
            message: 'Which department budget do you want to see?',
            choices: departmentArr
        }
    ];

    inquirer.prompt(viewDepartmentBudgetPrompt)
    .then(answers => {
        let index = departmentArr.map(function (x) { return x.name; }).indexOf(answers.department);
        const depNum = departmentArr[index].id;

        const sql = `SELECT roles.salary FROM roles WHERE roles.department_id = ${depNum}`;

        connection.query(sql, function(err, res, fields) {
            if (err) throw err;

            let budget = 0;
            for(let i=0; i<res.length; i++){
                budget += res[i].salary;
            }
            console.log(`The ${answers.department} department's total budget is $${budget}.`);
            startCompany();
        });
    });

}

