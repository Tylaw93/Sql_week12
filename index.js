const { prompt } = require("inquirer");
const db = require("./db");
require("console.table");

loadPrompts();

function loadPrompts() {
    prompt([
    {
      type: "list",
      name: "choice",
      message: "Choose an action?",
      choices: [
        {
          name: "View Employees",
          value: "VIEW_EMPLOYEES"
        },
        {
          name: "View Employees By Department",
          value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
        },
        {
          name: "View Employees By Manager",
          value: "VIEW_EMPLOYEES_BY_MANAGER"
        },
        {
          name: "Add Employee",
          value: "ADD_EMPLOYEE"
        },
        {
          name: "Delete Employee",
          value: "DELETE_EMPLOYEE"
        },
        {
          name: "Update Manager",
          value: "UPDATE_MANAGER"
        },
        {
            name: "View Departments",
            value: "VIEW_DEPARTMENTS"
          },
          {
            name: "Add Department",
            value: "ADD_DEPARTMENT"
          },
          {
            name: "Delete Department",
            value: "DELETE_DEPARTMENT"
          },
          {
            name: "View Total Budget By Department",
            value: "VIEW_BUDGET_BY_DEPARTMENT"
          },
        {
          name: "View Roles",
          value: "VIEW_ROLES"
        },
        {
          name: "Add Role",
          value: "ADD_ROLE"
        },
        {
          name: "Delete Role",
          value: "DELETE_ROLE"
        },
        {
            name: "Update Employee Role",
            value: "UPDATE_EMPLOYEE_ROLE"
        },
        {
          name: "Quit",
          value: "QUIT"
        }
      ]
    }
  ]).then(res => {
    let choice = res.choice;
    
    switch (choice) {
      case "VIEW_EMPLOYEES":
        viewEmployees();
        break;
      case "VIEW_EMPLOYEES_BY_DEPARTMENT":
        viewEmployeesByDepartment();
        break;
      case "VIEW_EMPLOYEES_BY_MANAGER":
        viewEmployeesByManager();
        break;
      case "ADD_EMPLOYEE":
        addEmployee();
        break;
      case "DELETE_EMPLOYEE":
        deleteEmployee();
        break;
      case "UPDATE_EMPLOYEE_ROLE":
        updateEmployeeRole();
        break;
      case "UPDATE_EMPLOYEE_MANAGER":
        updateEmployeeManager();
        break;
      case "VIEW_DEPARTMENTS":
        viewDepartments();
        break;
      case "ADD_DEPARTMENT":
        addDepartment();
        break;
      case "DELETE_DEPARTMENT":
        deleteDepartment();
        break;
      case "VIEW_BUDGET_BY_DEPARTMENT":
        viewBudgetByDepartment();
        break;
      case "VIEW_ROLES":
        viewRoles();
        break;
      case "ADD_ROLE":
        addRole();
        break;
      case "DELETE_ROLE":
        deleteRole();
        break;
      default:
        quit();
    }
  }
  )
}

function viewEmployees() {
    db.findEmployees()
      .then(([rows]) => {
        let employees = rows;
        console.log("\n");
        console.table(employees);
      })
      .then(() => loadMainPrompts());
  }

  function addEmployee() {
    prompt([
      {
        name: "first_name",
        message: "What is the employee's first name?"
      },
      {
        name: "last_name",
        message: "What is the employee's last name?"
      }
    ])
      .then(res => {
        let firstName = res.first_name;
        let lastName = res.last_name;
  
        db.findRoles()
          .then(([rows]) => {
            let roles = rows;
            const roleOptions = roles.map(({ id, title }) => ({
              name: title,
              value: id
            }));
  
            prompt({
              type: "list",
              name: "roleId",
              message: "What is the employee's role?",
              choices: roleOptions
            })
              .then(res => {
                let roleId = res.roleId;
  
                db.findEmployees()
                  .then(([rows]) => {
                    let employees = rows;
                    const managerOptions = employees.map(({ id, first_name, last_name }) => ({
                      name: `${first_name} ${last_name}`,
                      value: id
                    }));
  
                    managerOptions.unshift({ name: "None", value: null });
  
                    prompt({
                      type: "list",
                      name: "managerId",
                      message: "Who is the employee's manager?",
                      choices: managerOptions
                    })
                      .then(res => {
                        let employee = {
                          manager_id: res.managerId,
                          role_id: roleId,
                          first_name: firstName,
                          last_name: lastName
                        }
  
                        db.createEmployee(employee);
                      })
                      .then(() => console.log(
                        `Added ${firstName} ${lastName} to the database`
                      ))
                      .then(() => loadMainPrompts())
                  })
              })
          })
      })
  }

  function deleteEmployee() {
    db.findEmployees()
      .then(([rows]) => {
        let employees = rows;
        const employeeOptions = employees.map(({ id, first_name, last_name }) => ({
          name: `${first_name} ${last_name}`,
          value: id
        }));
  
        prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Which employee do you want to delete?",
            choices: employeeOptions
          }
        ])
          .then(res => db.deleteEmployee(res.employeeId))
          .then(() => console.log("deleted employee from the database"))
          .then(() => loadMainPrompts())
      })
  }

  function viewRoles() {
    db.findRoles()
      .then(([rows]) => {
        let roles = rows;
        console.log("\n");
        console.table(roles);
      })
      .then(() => loadMainPrompts());
  }
  
  function addRole() {
    db.findDepartments()
      .then(([rows]) => {
        let departments = rows;
        const departmentOptions = departments.map(({ id, name }) => ({
          name: name,
          value: id
        }));
  
        prompt([
          {
            name: "title",
            message: "What is the name of the role?"
          },
          {
            name: "salary",
            message: "What is the salary of the role?"
          },
          {
            type: "list",
            name: "department_id",
            message: "Which department does the role belong to?",
            choices: departmentOptions
          }
        ])
          .then(role => {
            db.createRole(role)
              .then(() => console.log(`Added ${role.title} to the database`))
              .then(() => loadMainPrompts())
          })
      })
  }
  
  function deleteRole() {
    db.findRoles()
      .then(([rows]) => {
        let roles = rows;
        const roleOptions = roles.map(({ id, title }) => ({
          name: title,
          value: id
        }));
  
        prompt([
          {
            type: "list",
            name: "roleId",
            message:
              "Which role do you want to delete? (Warning: This will also delete employees with this role)",
            choices: roleOptions
          }
        ])
          .then(res => db.deleteRole(res.roleId))
          .then(() => console.log("Deleted role from the database"))
          .then(() => loadMainPrompts())
      })
  }

  function updateEmployeeRole() {
    db.findEmployees()
      .then(([rows]) => {
        let employees = rows;
        const employeeOptions = employees.map(({ id, first_name, last_name }) => ({
          name: `${first_name} ${last_name}`,
          value: id
        }));
  
        prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Which employee's role do you want to update?",
            choices: employeeOptions
          }
        ])
          .then(res => {
            let employeeId = res.employeeId;
            db.findRoles()
              .then(([rows]) => {
                let roles = rows;
                const roleOptions = roles.map(({ id, title }) => ({
                  name: title,
                  value: id
                }));
  
                prompt([
                  {
                    type: "list",
                    name: "roleId",
                    message: "Which role do you want to assign the selected employee?",
                    choices: roleOptions
                  }
                ])
                  .then(res => db.updateEmployeeRole(employeeId, res.roleId))
                  .then(() => console.log("Updated employee's role"))
                  .then(() => loadMainPrompts())
              });
          });
      })
  }
  
  function updateEmployeeManager() {
    db.findEmployees()
      .then(([rows]) => {
        let employees = rows;
        const employeeOptions = employees.map(({ id, first_name, last_name }) => ({
          name: `${first_name} ${last_name}`,
          value: id
        }));
  
        prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Which employee's manager do you want to update?",
            choices: employeeOptions
          }
        ])
          .then(res => {
            let employeeId = res.employeeId
            db.findManagers(employeeId)
              .then(([rows]) => {
                let managers = rows;
                const managerOptions = managers.map(({ id, first_name, last_name }) => ({
                  name: `${first_name} ${last_name}`,
                  value: id
                }));
  
                prompt([
                  {
                    type: "list",
                    name: "managerId",
                    message:
                      "Which employee do you want to set as manager for the selected employee?",
                    choices: managerOptions
                  }
                ])
                  .then(res => db.updateEmployeeManager(employeeId, res.managerId))
                  .then(() => console.log("Updated employee's manager"))
                  .then(() => loadMainPrompts())
              })
          })
      })
  }

  function viewDepartments() {
    db.findDepartments()
      .then(([rows]) => {
        let departments = rows;
        console.log("\n");
        console.table(departments);
      })
      .then(() => loadMainPrompts());
  }
  
  function addDepartment() {
    prompt([
      {
        name: "name",
        message: "What is the name of the department?"
      }
    ])
      .then(res => {
        let name = res;
        db.createDepartment(name)
          .then(() => console.log(`Added ${name.name} to the database`))
          .then(() => loadMainPrompts())
      })
  }
  
  function deleteDepartment() {
    db.findDepartments()
      .then(([rows]) => {
        let departments = rows;
        const departmentOptions = departments.map(({ id, name }) => ({
          name: name,
          value: id
        }));
  
        prompt({
          type: "list",
          name: "departmentId",
          message:
            "Which department would you like to delete? (Warning: This will also delete associated roles and employees)",
          choices: departmentOptions
        })
          .then(res => db.deleteDepartment(res.departmentId))
          .then(() => console.log(`Deleted department from the database`))
          .then(() => loadMainPrompts())
      })
  }

  function viewBudgetByDepartment() {
    db.viewDepartmentBudgets()
      .then(([rows]) => {
        let departments = rows;
        console.log("\n");
        console.table(departments);
      })
      .then(() => loadMainPrompts());
  }
  