const inquirer = require('inquirer');
const fs = require('fs');
const pg = require('pg');
const { Pool } = require('pg');
const { Console } = require('console');
const { addAbortListener } = require('events');

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
                        mainMenu()
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
    pool.query("SELECT * FROM DEPARTMENT", function (err, data) {
        if (err) throw err;
        // console.log(data)
        const depList = data.rows.map(dept => ({
            value: dept.id,
            name: dept.name
        }))
        // console.log(depList)


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
                    choices: depList
                    //  choices: ['Management', 'Sales', 'Engineering', 'Finance', 'Marketing', 'Human Resources'],
                }
            ])
            .then((answers) => {
                const { title, salary, department } = answers;
                // Implement logic to add the role to the database
                pool.query(
                    'INSERT INTO role (title, salary,department_id) VALUES ($1, $2, $3)',
                    [title, salary, department],
                    (error, result) => {
                        if (error) {
                            console.log('An error occurred:', error);
                        } else {
                            console.log('Role added successfully');
                        }
                        mainMenu()
                    }
                );
            })
            .catch((error) => {
                console.log('An error occurred:', error);
            });
    })
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
                        mainMenu()
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
                        mainMenu()
                    }
                }
            );
        })
        .catch((error) => {
            console.log('An error occurred:', error);
        });
}

function viewAllEmployees() {
    pool.query('Select employee.id, employee.first_name AS "First Name", employee.last_name AS "Last Name", role.title as "Title", role.salary as "Salary", manager_id as "Manager ID", department.name as "Department" from employee join role on employee.role_id = role.id join department on role.department_id = department.id', (error, result) => {
        if (error) {
            console.log('An error occurred:', error);
        } else {
            console.log('List of employees:');
            console.table(result.rows);
            mainMenu()
        }

    });
}

function addEmployee() {

    pool.query("SELECT * FROM ROLE", function (err, data) {
        if (err) throw err;
        // console.log(data)
        const roleList = data.rows.map(role => ({
            value: role.id,
            name: role.title
        }))

        pool.query("SELECT * FROM EMPLOYEE  WHERE MANAGER_ID IS NULL;", function (err, data1) {
            if (err) throw err;
            // console.log(data)
            let managerList = data1.rows.map(employee => ({
                value: employee.id,
                name: employee.first_name + " " + employee.last_name
            }))
            managerList.push({
                name: "Not applicable", value: null
            })
            console.log(managerList)
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: 'Enter employee\'s first name:',
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'Enter employee\'s last name:',
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Enter employee role:',
                        choices: roleList
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Enter manager:',
                        choices: managerList
                        //  choices: ['Management', 'Sales', 'Engineering', 'Finance', 'Marketing', 'Human Resources'],
                    }
                ])
                .then((answers) => {
                    const { firstName, lastName, role, manager } = answers;
                    // Implement logic to add the role to the database
                    pool.query(
                        'INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
                        [firstName, lastName, role, manager],
                        (error, result) => {
                            if (error) {
                                console.log('An error occurred:', error);
                            } else {
                                console.log('Employee added successfully');
                            }
                            mainMenu()
                        }
                    );
                })
                .catch((error) => {
                    console.log('An error occurred:', error);
                });
        })
    })
};


function viewAllRoles() {
    pool.query('SELECT role.title AS "Role" FROM role', (error, result) => {
        if (error) {
            console.log('An error occurred:', error);
        } else {
            console.log('List of roles:');
            console.table(result.rows);
            mainMenu()
        }
    });
}

async function viewAllDepts() {
    try {
        const result = await pool.query('SELECT * FROM department');
        console.log('List of departments:');
        console.table(result.rows);
        mainMenu()
    } catch (error) {
        console.log('An error occurred:', error);
    }

}

// Initialize the application

function mainMenu() {



    inquirer
        .prompt([
            {
                type: 'list',
                name: 'menu',
                message: 'Please select an option:',
                choices: ['View All Employees', 'View All Departments', 'View All Roles', 'Add Role', 'Add Department', 'Add Employee', 'Update Employee', 'Delete Employee', 'Exit'],
            },
        ])
        .then((answers) => {
            // Based on the user's choice, perform the corresponding action
            switch (answers.menu) {
                case 'View All Employees':
                    // Implement logic to view entire employee database
                    viewAllEmployees();
                    break;

                case 'View All Roles':
                    // Implement logic to view roles
                    viewAllRoles();
                    break;
                case 'Add Role':
                    // Implement logic to view roles
                    addRole();
                    break;
                case 'View All Departments':
                    // Implement logic to view departments
                    viewAllDepts();
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
                case 'Exit':
                    pool.end();
                    process.exit(0)
                default:
                    console.log('Invalid option');
            }
        })
        .catch((error) => {
            console.log('An error occurred:', error);
        });
}

mainMenu()
