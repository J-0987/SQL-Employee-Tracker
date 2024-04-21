const inquirer = require('inquirer');
const fs = require('fs');
const pg = require('pg');


const PORT = process.env.PORT || 3001;

function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter the employee name:',
            },
            {
                type: 'input',
                name: 'role',
                message: 'Enter the employee role:',
            },
        ])
        .then((answers) => {
            const { name, role } = answers;
            // Implement logic to add the employee to the database
            pool.query(
                'INSERT INTO employees (name, role) VALUES ($1, $2)',
                [name, role],
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
                'INSERT INTO departments (name) VALUES ($1)',
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
        ])
        .then((answers) => {
            const { title, salary } = answers;
            // Implement logic to add the role to the database
            pool.query(
                'INSERT INTO roles (title, salary) VALUES ($1, $2)',
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
function deleteDepartment() { };
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
                'UPDATE employees SET role = $1 WHERE id = $2',
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
                'DELETE FROM employees WHERE id = $1',
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
            choices: ['View Employees', 'Add Employee', 'Update Employee', 'Delete Employee'],
        },
    ])
    .then((answers) => {
        // Based on the user's choice, perform the corresponding action
        switch (answers.menu) {
            case 'View  All Employees':
                // Implement logic to view employees
                pool.query('SELECT * FROM employees', (error, result) => {
                    if (error) {
                        console.log('An error occurred:', error);
                    } else {
                        console.log('List of employees:');
                        result.rows.forEach((employee) => {
                            console.log(`- ${employee.name}`);
                        });
                    }
                });
                break;
            case 'View All Roles':
                // Implement logic to add an employee
                pool.query('SELECT * FROM roles', (error, result) => {
                    if (error) {
                        console.log('An error occurred:', error);
                    } else {
                        console.log('List of employees:');
                        result.rows.forEach((employee) => {
                            console.log(`- ${employee.name}`);
                        });
                    }
                });
                break;
            case 'View All Departments':
                // Implement logic to add an employee
                pool.query('SELECT * FROM departments', (error, result) => {
                    if (error) {
                        console.log('An error occurred:', error);
                    } else {
                        console.log('List of employees:');
                        result.rows.forEach((employee) => {
                            console.log(`- ${employee.name}`);
                        });
                    }
                });
                
                break;
            case 'Add Employee':
                // Implement logic to add an employee
                addEmployee();
                break;
            case 'Update Employee Role':
                // Implement logic to update an employee
                updateEmployee()
                break;
            case 'Add Role':
                // Implement logic to delete an employee
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
