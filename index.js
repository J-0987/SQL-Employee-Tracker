const inquirer = require('inquirer');
const fs = require('fs');
const pg = require('pg');
const { Pool } = require('pg');
const { Console } = require('console');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'employee_db',
    password: 't@lkingduck',
    port: 5432,
});

pool.connect()
    .then(() => console.log('Connected to the employee_db database!'))
    .catch(err => console.error('Error connecting to database', err));
const PORT = process.env.PORT || 3001;

// * Define functions to perform the following actions:


// WHEN I choose to add an employee THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
 function addEmployee() {
const allDepartments = async ()=> {
 allDepts = await pool.query('select id, name from department')
console.log(allDepts.rows);
const deptList = allDepts.rows.map ( (d)=> ({
   name: d.name,
   value: d.id,
}))

 return deptList;
 }
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'Enter the employee\'s first name:',
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'Enter the employee\'s last name:',
            },
            {
                type: 'list',
                name: 'role',
                message: 'Enter the employee role:',
                choices: allDepartments,
                // ['Management', 'Sales', 'Engineering', 'Finance', 'Marketing', 'Human Resources', 'IT', 'Operations'],
            },
        
            {
                type: 'list',
                name: 'manager_id',
                message: 'Enter the employee\'s manager:',
                choices: ['John, Doe', 'Jane, Smith', 'Alice, Williams', 'Steve, Brown', 'Michael, Johnson', 'Emily, Davis', 'David, Miller', 'Sarah, Anderson'],
            },
        ])
        .then((answers) => {
            const { firstName, lastName, role, manager_id } = answers;
            // Implement logic to add the employee to the database
            // ? How do i break apart the manager input to get the first and last name and assign it an id that corresponds with its employee id?

            pool.query(
                'INSERT INTO employee (first_name, last_name, role, manager) VALUES ($1, $2, $3, $4)',
                [firstName, lastName, role, manager],
                (error, result) => {
                    if (error) {
                        console.log('An error occurred:', error);
                    } else {
                        console.log('Employee added successfully');
                    }
                }
            );
        })
        .catch((error) => {
            console.log('An error occurred:', error);
        });
};



// WHEN I choose to add a department THEN I am prompted to enter the name of the department and that department is added to the database 
// * Works
function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter the department name. Ensure it is not one of our existing departments (Management, Sales, Engineering, Finance, Marketing, Human Resources,IT,Operations):',
            },
        ])
        .then((answers) => {
            const { name } = answers;
            // Implement logic to add the department to the database
            pool.query(
                'INSERT INTO department (name) VALUES ($1)',
                [name],
                (error, result) => {
                    if (error) {
                        console.log('An error occurred:', error);
                    } else {
                        console.log('Department added successfully');
                    }
                }
            );
        })
        .catch((error) => {
            console.log('An error occurred:', error);
        });
};
//WHEN I choose to add a role THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// ? The same question as addEmployee. How do I break apart the department input to get the name and assign it an id that corresponds with its department id?
function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the role title:',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the role salary:',
            },
            {
                type: 'list',
                name: 'department',
                message: 'Choose the department for this role:',
                choices: ['Management', 'Sales', 'Engineering', 'Finance', 'Marketing', 'Human Resources'],
            },
        ])
        .then((answers) => {
            const { title, salary, department } = answers;
            // Implement logic to add the role to the database
            pool.query(
                'INSERT INTO role (title, salary) VALUES ($1, $2, $3)',
                [title, salary, department],
                (error, result) => {
                    if (error) {
                        console.log('An error occurred:', error);
                    } else {
                        console.log('Role added successfully');
                    }
                }
            );
        })
        .catch((error) => {
            console.log('An error occurred:', error);
        });
};
// WHEN I choose to update an employee role THEN I am prompted to select an employee to update and their new role and this information is updated in the databas
function updateEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'employeeId',
                message: 'Enter the ID of the employee you want to update:',
            },
            {
                type: 'list',
                name: 'newRole',
                message: 'Select the new role for the employee:',
                choices: [
                    'Manager',
                    'Sales Lead',
                    'Salesperson',
                    'Lead Engineer',
                    'Marketing Manager',
                    'HR Specialist',
                    'IT Analyst',
                    'Operations Manager'
                ],
            },
        ])
        .then((answers) => {
            const { employeeId, newRole } = answers;
            // Implement logic to update the employee's role in the database
            pool.query(
                'UPDATE employee SET role = $1 WHERE id = $2',
                [newRole, employeeId],
                (error, result) => {
                    if (error) {
                        console.log('An error occurred:', error);
                    } else {
                        console.log('Employee role updated successfully');
                    }
                }
            );
        })
        .catch((error) => {
            console.log('An error occurred:', error);
        });
}
function deleteEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'employeeId',
                message: 'Enter the ID of the employee you want to delete:',
            },
        ])
        .then((answers) => {
            const { employeeId } = answers;
            // Implement logic to delete the employee from the database
            pool.query(
                'DELETE FROM employee WHERE id = $1',
                [employeeId],
                (error, result) => {
                    if (error) {
                        console.log('An error occurred:', error);
                    } else {
                        console.log('Employee deleted successfully');
                    }
                }
            );
        })
        .catch((error) => {
            console.log('An error occurred:', error);
        });
}


// Initialize the application

function mainMenu (){



inquirer
    .prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'Please select an option:',
            choices: ['View All Employees', 'View All Departments', 'View All Roles', 'Add Department', 'Add Employee', 'Update Employee', 'Delete Employee'],
        },
    ])
    .then((answers) => {
        // Based on the user's choice, perform the corresponding action
        switch (answers.menu) {
            case 'View All Employees':
                // Implement logic to view entire employee database
                pool.query('Select employee.id, employee.first_name AS "First Name", employee.last_name AS "Last Name", role.title as "Title", role.salary as "Salary", department.name as "Department" from employee join role on employee.role_id = role.id join department on role.department_id = department.id', (error, result) => {
                    if (error) {
                        console.log('An error occurred:', error);
                    } else {
                        console.log('List of employees:');
                        console.table(result.rows);
                    }
                    .then(mainMenu)
                });
                break;

            case 'View All Roles':
                // Implement logic to view roles
                pool.query('SELECT role.title AS "Role" FROM role', (error, result) => {
                    if (error) {
                        console.log('An error occurred:', error);
                    } else {
                        console.log('List of roles:');
                        console.table(result.rows);
                    }
                });
                break;
            case 'View All Departments':
                // Implement logic to view departments
                pool.query('SELECT * FROM department', (error, result) => {
                    if (error) {
                        console.log('An error occurred:', error);
                    } else {
                        console.log('List of departments:');
                        console.table(result.rows);
                    }
                });
                break;
            case 'Add Employee':
                // Implement logic to add an employee
                addEmployee();
                break;

            case 'Add Department':
                // Implement logic to add a department
                addDepartment();
                break;

            case 'Update Employee Role':
                // Implement logic to update an employee
                updateEmployee();
                break;
            case 'Add Role':
                // Implement logic to add a role
                addRole();
                break;
            case 'Delete Employee':
                // Implement logic to delete an employee
                deleteEmployee();
                break;
            default:
                console.log('Invalid option');
        }
    })
    .catch((error) => {
        console.log('An error occurred:', error);
    });
}

mainMenu()
