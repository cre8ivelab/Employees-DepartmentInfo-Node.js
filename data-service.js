const fs = require("fs");   //include fs module
//variable to store the data from JSON
var employees = [];
var departments = [];
var managers = [];

//set a promise
module.exports.intialize = function(){

    return new Promise(function(resolve,reject){
        fs.readFile("./data/employees.json",'utf-8',function(err,data){
            if(err) return reject("Unable to read file"); //rejects if there is an error to resd the file
            // convert into strings
            employees = JSON.parse(data);
            fs.readFile("./data/departments.json",'utf-8',function(err,data){
                if(err) return reject("Unable to read file"); //rejects if there is an error to resd the file
                // convert string into an object
                departments = JSON.parse(data);
                resolve();
            });
        });
    });
}

//getAllEmployees function returning the array of object employees
module.exports.getAllEmployees = function(){
    return new Promise(function(resolve,reject){
        if(employees.length === 0)
            reject("no results returned");
        resolve(employees);
    });
}
//getDepartments function returning the array of object departments
module.exports.getDepartments = function(){
    return new Promise(function(resolve,reject){
        if(departments.length === 0)
            reject("no results returned");
        resolve(departments);
    });
}
//getManagers function returning the array of object employees
module.exports.getManagers = function(){
    return new Promise(function(resolve,reject){
        managers = employees.filter((obj) =>{
            return obj.isManager;
        });
        if(managers.length === 0)
            reject("no results returned");
        resolve(managers);
    });
}

//The addEmployee function receive the form data and adds it to the employees array.
module.exports.addEmployee = function(employeeData){
    return new Promise((resolve,reject) => {
        if(employeeData.isManager == undefined)
            employeeData.isManager = false;
        else
            employeeData.isManager = true;
        employeeData.employeeNum = employees.length + 1;
        employees.push(employeeData);
        resolve();
    });
}

//The getEmployeesByStatus return the employees whose "status" match with the "query string status" 
module.exports.getEmployeesByStatus = function(status){
    return new Promise((resolve,reject) => {
        var empstatus = [];
        empstatus = employees.filter((x) => {
            return x.status == status;
        });
        if(empstatus.length == 0)
            reject("no results returned");
        
        resolve(empstatus);
    });
}

//The getEmployeesByStatus return the employees whose "department" match with the "query string department" 
module.exports.getEmployeesByDepartment = function(department){
    return new Promise((resolve,reject) => {
        var empdept = [];
        empdept = employees.filter((x) => {
            return x.department == department;
        });
        if(empdept.length == 0)
            reject("no results returned");
        
         resolve(empdept);
    });
}

//The getEmployeesByStatus return the employees whose "department" match with the "query string department" 
module.exports.getEmployeesByManager = function(manager){
    return new Promise((resolve,reject) => {
        var empmgr = [];
        empmgr = employees.filter((x) => {
            return x.employeeManagerNum == manager;
        });
        if(empmgr.length == 0)
            reject("no results returned");
    
        resolve(empmgr);
    });
}

// The getEmployeeByNum return an employee data whose employee number received in the parameter.
module.exports.getEmployeeByNum = function(num){
    return new Promise((resolve, reject) => {
        var emp = employees.find(x => x.employeeNum == num);
        if(!emp)
            reject("no results returned");
        resolve(emp);
    });
}

//The updateEmployee will update a employee data in our records
module.exports.updateEmployee = function(employeeData){
    return new Promise((resolve,reject) => {
        var emp = employees.find(x => x.employeeNum == employeeData.employeeNum);
        var index = employees.indexOf(emp);
        // employees.splice(index, 1, employeeData);
        employees[index].employeeNum = employeeData.employeeNum;
        employees[index].firstName = employeeData.firstName;
        employees[index].lastName = employeeData.lastName;
        employees[index].email = employeeData.email;
        employees[index].SSN = employeeData.SSN;
        employees[index].addressStreet = employeeData.addressStreet;
        employees[index].addressCity = employeeData.addressCity;
        employees[index].addressState = employeeData.addressState;
        employees[index].addressPostal = employeeData.addressPostal;
        employees[index].maritalStatus = employeeData.maritalStatus;
        employees[index].isManager = employeeData.isManager;
        employees[index].employeeManagerNum = employeeData.employeeManagerNum;
        employees[index].status = employeeData.status;
        employees[index].department = employeeData.department;
        employees[index].hireDate = employeeData.hireDate;
        if(!employees[index])
            reject("update failed");
        resolve();
    });
} 