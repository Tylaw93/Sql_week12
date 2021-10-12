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
          name: "Remove Employee",
          value: "REMOVE_EMPLOYEE"
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
            name: "Remove Department",
            value: "REMOVE_DEPARTMENT"
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
          name: "Remove Role",
          value: "REMOVE_ROLE"
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
  ])
}