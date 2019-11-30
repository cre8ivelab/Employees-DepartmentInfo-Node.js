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
        type: Sequelize.INTEGER,
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
},{
    createdAt: false,
    updatedAt: false
});

//Department sequelize model
var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
},{
    createdAt: false,
    updatedAt: false
});

Department.hasMany(Employee, {foreignKey: 'department'});

//set a promise
module.exports.intialize = function(){
    return new Promise(function (resolve, reject) {
        sequelize.sync()
        .then(() => resolve())
        .catch(() => reject("unable to sync the database"))
        
    });
}

/*-------------------------------------------------------------------
                            EMPLOYEES
-------------------------------------------------------------------*/

//getAllEmployees function returning the array of object employees
module.exports.getAllEmployees = function(){
    return new Promise(function (resolve, reject) {
        Employee.findAll()
        .then((data) => resolve(data))
        .catch(() => reject("no results returned"));
    });
}

//The addEmployee function receive the form data and adds it to the employees array.
module.exports.addEmployee = function(employeeData){
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for(var prop in employeeData)
        {
            //needs to complete
        }
        Employee.create({
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            SSN: employeeData.SSN,
            addressStreet: employeeData.addressStreet,
            addressCity: employeeData.addressCity,
            addressState: employeeData.addressState,
            addressPostal: employeeData.addressPostal,
            maritalStatus: employeeData.maritalStatus,
            isManager: employeeData.isManager,
            employeeManagerNum: employeeData.employeeManagerNum,
            status: employeeData.status,
            hireDate: employeeData.hireDate
        }) 
        .then((data) => resolve(data))
        .catch(() => reject("unable to create employee"));
    });
}

//The getEmployeesByStatus return the employees whose "status" match with the "query string status" 
module.exports.getEmployeesByStatus = function(st){
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                status : st
            }
        })
        .then((data) => resolve(data))
        .catch(() => reject("no results returned"));
    });
}

//The getEmployeesByStatus return the employees whose "department" match with the "query string department" 
module.exports.getEmployeesByDepartment = function(id){
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                department : id
            }
        })
        .then((data) => resolve(data))
        .catch(() => reject("no results returned"));
    });
}

//The getEmployeesByStatus return the employees whose "department" match with the "query string department" 
module.exports.getEmployeesByManager = function(manager){
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                employeeManagerNum : manager
            }
        })
        .then((data) => resolve(data))
        .catch(() => reject("no results returned"));
    });
}

// The getEmployeeByNum return an employee data whose employee number received in the parameter.
module.exports.getEmployeeByNum = function(num){
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                employeeNum : num
            }
        })
        .then((data) => resolve(data[0]))
        .catch(() => reject("no results returned"));
    });
}

//The updateEmployee will update a employee data in our records
module.exports.updateEmployee = function(employeeData){
    return new Promise(function (resolve, reject) {
        for(var i in employeeData)
        {
            if(!employeeData[i])
                employeeData[i] = null;
        }
        employeeData.isManager = (employeeData.isManager) ? true : false;
        Employee.update(employeeData, {   
            where: { employeeNum: employeeData.employeeNum}
        })
        .then(() => resolve())
        .catch(() => reject("unable to update employee"));
    });
}

//delete a employee
module.exports.deleteEmployeeByNum = (empNum) => {
    return new Promise((resolve,reject) => {
        Employee.destroy({
            where: {employeeNum: empNum}
        })
        .then(() => resolve("destoyed"))
        .catch(() => reject("employee not found"));
    });
}

/*-------------------------------------------------------------------
                            Departments
-------------------------------------------------------------------*/

//getDepartments function returning the array of object departments
module.exports.getDepartments = function(){
    return new Promise(function (resolve, reject) {
        Department.findAll()
        .then((data) => resolve(data))
        .catch(() => reject("no results returned"));
    });
}

//add departments
module.exports.addDepartments = (departmentData) => {
    return new Promise((resolve, reject) => {
        for(var i in departmentData)
        {
            if (!departmentData[i])
                departmentData[i] = null;
        }
        Department.create({
            departmentName: departmentData.departmentName
        })   //needs attention
        .then((data) => resolve(data))
        .catch(() => reject("unable to create department"));
    });
}

//update deaprtments
module.exports.updateDepartment = (departmentData) => {
    return new Promise((resolve, reject) => {
        for(var i in departmentData)
        {
            if(!departmentData[i])
                departmentData[i] = null;
        }
        Department.update({
            departmentName: departmentData.departmentName},
            {where: { departmentId: departmentData.departmentId}
        })   
        .then(() => resolve())
        .catch(() => reject("unable to update department"));
    });
}

//filter departments by departmentId
module.exports.getDepartmentById = (id) => {
    return new Promise((resolve, reject) => {
        Department.findAll({
            where: {departmentId : id}
        })
        .then(data => resolve(data))
        .catch(() => reject("department not found"));
    });
}

//delete the department by the given ID
module.exports.deleteDepartmentById = (id) => {
    return new Promise((resolve, reject) => {
        Department.destroy({
            where: {departmentId: id}
        })
        .then(() => resolve())
        .catch(() => reject("department not found"));
    });
}