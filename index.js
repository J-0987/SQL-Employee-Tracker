const inquirer = require('inquirer');
const fs = require('fs');
const pg = require('pg');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'employee_db',
  password: 't@lkingduck',
  port: 5432,
});


const PORT = process.env.PORT || 3001;
// WHEN I choose to add an employee THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
function addEmployee() {
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
                choices: ['Management', 'Sales', 'Engineering', 'Finance', 'Marketing', 'Human Resources', 'IT', 'Operations'],
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Enter the employee\'s manager:',
                choices: ['Doe,John', 'Smith,Jane',  'Williams,Alice','Brown,Steve', 'Johnston,Michael', 'Davis,Emily',  'Miller,David', 'Anderson,Sarah'],
            },
        ])
        .then((answers) => {
            const { firstName, lastName, role, manager } = answers;
            // Implement logic to add the employee to the database
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
function addDepartment() { 
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter the department name:',
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
                type: 'input',
                name: 'department',
                message: 'Enter the department for this role:',
            },
        ])
        .then((answers) => {
            const { title, salary } = answers;
            // Implement logic to add the role to the database
            pool.query(
                'INSERT INTO role (title, salary) VALUES ($1, $2)',
                [title, salary],
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
                type: 'input',
                name: 'newRole',
                message: 'Enter the new role for the employee:',
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
                        console.table(result.rows.map(department => ({ Name: department.name })));
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
