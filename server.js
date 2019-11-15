/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Ranjit Prajapati Student ID: 154561179 Date: Oct. 31, 2019
*
*  Online (Heroku) Link: https://pure-falls-04653.herokuapp.com/
*
********************************************************************************/ 
const data_service = require("./data-service.js") //using module data-service.js
const express = require("express");   //using module express
const multer = require("multer");   //using multer module to deal with form-files
const fs = require("fs");   //using fs module to deal with filestream objects
const exhbs = require("express-handlebars");    //using handlebars module 
const bodyParser = require("body-parser");  //using body-parser module
const HTTP_PORT = process.env.PORT || 8080;   //server will listen on port 8080
const app = express();  
const path = require("path");     //storing the current path in the varaible "path"

//Print this when the server starts listening 
function onHttpStart() {
    console.log("Express http server listening on " + HTTP_PORT);
}

//set engine for handlebars
app.engine('.hbs',exhbs({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }              
    }
}));
app.set('view engine', '.hbs');

const storage = multer.diskStorage({
    destination: "./public/images/uploaded/",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });

//to get the correct css from server
app.use(express.static('public')); 

//Middleware to show active menus
app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});


//The route "/" must call the home.html file from views folder
app.get("/", function(req,res){
    res.render('home');
});

//The "/about" must call the about.html file from views folder
app.get("/about", function(req,res){
    res.render('about');
});

//The route "/employees" will show the employees array containing the employees data with queries and without queries
app.get("/employees", function(req,res){
    var loadData;
    if(req.query.status)
        loadData = data_service.getEmployeesByStatus(req.query.status);
    else if(req.query.department)
        loadData = data_service.getEmployeesByDepartment(req.query.department);
    else if(req.query.manager)
        loadData = data_service.getEmployeesByManager(req.query.manager);
    else
        loadData = data_service.getAllEmployees();

    loadData.then((emp) => {
        if(emp.length > 0)
            res.render('employees', {data: emp});
        else
            res.render('employees', {message: "no results"});
    })
    .catch((err) => res.render({message: err}));
});

//The route "/departments" will show the departments array containing the departments data
app.get("/departments", function(req,res){
    data_service.getDepartments()
    .then((dept) => {
        if(dept.length > 0)
            res.render("departments", {data: dept});
        else
            res.render("departments", {message: "no results"});  
    })
    .catch(() => res.render({message: "no results"}));
});

//The route "/employees/add" will get the registration form for employees
app.get("/employees/add", (req,res) => {
    data_service.getDepartments()
    .then((dep) => res.render('addEmployee', {departments: dep}))
    .catch(() => res.render('addEmployee', {departments: []}));
});

//The route "/departments/add" will get the registration form for departments
app.get("/departments/add", (req,res) => {
    res.render('addDepartment');
});

//The route "/images/add" will get the page to upload a image
app.get("/images/add", (req,res) => {
    res.render('addImage');
});

//The post request to the "/images" route.
app.post("/images/add", upload.single("imageFile"), (req,res) => {
    res.redirect("/images");
});

//The get request of images posted by "/images/add" route
app.get("/images", (req,res) => {
    fs.readdir("./public/images/uploaded", (err, items) => {
        res.render("images", {
            data: items
        });
    });
});

//add the middleware bodyParser.urlencoded.
app.use(bodyParser.urlencoded({ extended: true }));

//post method to add the new employee from the add employee form page.
app.post("/employees/add", (req,res) => {
    data_service.addEmployee(req.body)
    .then(() => res.redirect("/employees"))
    .catch(() => res.render({message: "no results"})); 
});

//post method to add the new department from the add department form page.
app.post("/departments/add", (req,res) => {
    data_service.addDepartments(req.body)
    .then(() => res.redirect("/departments"))
    .catch(() => res.render({message: "no results"})); 
});

//post method to update the employee information
app.post("/employee/update", (req, res) => {
    data_service.updateEmployee(req.body)
    .then(() => res.redirect("/employees"))
    .catch(() => res.render({message: "no results"}));
});

//post method to update the department information
app.post("/department/update", (req, res) => {
    data_service.updateDepartment(req.body)
    .then(() => res.redirect("/departments"))
    .catch(() => res.render({message: "no results"}));
});

//The route "/employee/:value" will shows the employee as per the parameter.
/* app.get("/employees/:empname", (req, res) => {
    data_service.getEmployeeByNum(req.params.empname)
    .then((emp) => res.render("employee", {
        employee: emp
    }))
    .catch((err) => res.send(err));
});*/
app.get("/employee/:empNum", (req, res) => {

    // initialize an empty object to store the values
    let viewData = {};

    data_Service.getEmployeeByNum(req.params.empNum).then((data) => {
        if (data) {
            viewData.employee = data; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
    }).catch(() => {
        viewData.employee = null; // set employee to null if there was an error 
    }).then(data_Service.getDepartments)
    .then((data) => {
        viewData.departments = data; // store department data in the "viewData" object as "departments"

        // loop through viewData.departments and once we have found the departmentId that matches
        // the employee's "department" value, add a "selected" property to the matching 
        // viewData.departments object

        for (let i = 0; i < viewData.departments.length; i++) {
            if (viewData.departments[i].departmentId == viewData.employee.department) {
                viewData.departments[i].selected = true;
            }
        }

    }).catch(() => {
        viewData.departments = []; // set departments to empty if there was an error
    }).then(() => {
        if (viewData.employee == null) { // if no employee - return an error
            res.status(404).send("Employee Not Found");
        } else {
            res.render("employee", { viewData: viewData }); // render the "employee" view
        }
    });
});


//The route "/department/:value" will shows the department as per the parameter.
app.get("/departments/:depname", (req, res) => {
    data_service.getDepartmentById(req.params.depname)
    .then((dep) => {
        if(dep.length > 0)
            res.render("department", {department: dep});
        else
            res.status(404).send("Department Not Found");
    })
    .catch(() => res.status(404).send("Department Not Found"));
});

//The route "/employees/delete/:empNum" will delete the employee as per the parameter.
app.get("/employees/delete/:empNum", (req, res) => {
    data_service.deleteEmployeeByNum(req.params.empNum)
    .then(() => res.redirect('/employees'))
    .catch(() => res.status(500).send("Unable to Remove Employee / Employee not found)"));
});

//The route "/department/delete/:depId" will delete the department as per the parameter.
app.get("/departments/delete/:depId", (req, res) => {
    data_service.deleteDepartmentById(req.params.depId)
    .then(() => res.redirect('/departments'))
    .catch(() => res.status(500).send("Unable to Remove Department / Department not found)"));
});

//The get request to error 404 page 
app.get('*', (req,res) => {
    res.redirect('https://i.pinimg.com/originals/b2/b9/16/b2b916a908fb0ee0cce790841a54d394.png');
});

//setup htttp server to listen on HTTP_PORT
data_service.intialize()
.then(() => {app.listen(HTTP_PORT, onHttpStart);})
.catch((err) => {console.log(err)});