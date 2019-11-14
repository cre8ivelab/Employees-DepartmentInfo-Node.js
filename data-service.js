const Sequelize = require('sequelize');
var sequelize = new Sequelize('d4e89ai9iepn6e', 'tmmanuqjjsawji', 'f4109dc16690cc4b7655a811e181deb96ec14cfd4f752b2f18be331e753b8d68', {
    host: 'ec2-174-129-252-240.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: true
    }
});

//employees sequelize model
var Employee = sequelize.define('Employee',{
    employeeNum: {
        type: Sequelize.INTERGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    hireDate: Sequelize.STRING
});

//Department sequelize model
var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});


//set a promise
module.exports.intialize = function(){
    return new Promise(function (resolve, reject) {
        reject();
    });
}

//getAllEmployees function returning the array of object employees
module.exports.getAllEmployees = function(){
    return new Promise(function (resolve, reject) {
        reject();
    });
}
//getDepartments function returning the array of object departments
module.exports.getDepartments = function(){
    return new Promise(function (resolve, reject) {
        reject();
    });
}
//getManagers function returning the array of object employees
module.exports.getManagers = function(){
    return new Promise(function (resolve, reject) {
        reject();
    });
}

//The addEmployee function receive the form data and adds it to the employees array.
module.exports.addEmployee = function(employeeData){
    return new Promise(function (resolve, reject) {
        reject();
    });
}

//The getEmployeesByStatus return the employees whose "status" match with the "query string status" 
module.exports.getEmployeesByStatus = function(status){
    return new Promise(function (resolve, reject) {
        reject();
    });
}

//The getEmployeesByStatus return the employees whose "department" match with the "query string department" 
module.exports.getEmployeesByDepartment = function(department){
    return new Promise(function (resolve, reject) {
        reject();
    });
}

//The getEmployeesByStatus return the employees whose "department" match with the "query string department" 
module.exports.getEmployeesByManager = function(manager){
    return new Promise(function (resolve, reject) {
        reject();
    });
}

// The getEmployeeByNum return an employee data whose employee number received in the parameter.
module.exports.getEmployeeByNum = function(num){
    return new Promise(function (resolve, reject) {
        reject();
    });
}

//The updateEmployee will update a employee data in our records
module.exports.updateEmployee = function(employeeData){
    return new Promise(function (resolve, reject) {
        reject();
    });
} 