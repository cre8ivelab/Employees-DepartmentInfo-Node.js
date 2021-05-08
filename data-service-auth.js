const mongoose = require("mongoose"); //mongoose model
const bcrypt = require('bcryptjs'); //using bcryptjs module
var Schema = mongoose.Schema;   //a new schema 
var userSchema = new Schema({
    "userName": {
        "type": String,
        "unique": true
    },
    "password": String,
    "email": String,
    "loginHistory": [{
        "dateTime": Date,
        "userAgent": String
    }]
});
let User; // to be defined on new connection

//intialize function to connect MongoDB before we start the application
module.exports.intialize = function(){
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection("your database connection URI");
        db.on('error', (err)=>{
        reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
        User = db.model("users", userSchema);
        resolve();
        });
    });
}

//register a new user
module.exports.registerUser = (userData) => {
    return new Promise((resolve, reject) => {
        if(userData.password != userData.password2) //check the passwords match or not
            reject("Passwords do not match");
        else
        {
            let newUser = new User(userData);
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(userData.password, salt, (err, hash) => {
                    if(err)
                        reject("There was an error encrypting the password");
                    else{
                        newUser.password = hash;
                        newUser.save()
                        .then(() => resolve())
                        .catch((err) => {
                            if(err.code == 11000)
                                reject("User Name already taken");
                            else
                                reject("There was an error creating the user: " + err);
                        });
                    }
                });
            });
        }
    });
}

//check the user's existance
module.exports.checkUser = (userData) => {
    return new Promise((resolve, reject) => {
        User.find({userName: userData.userName})
        .exec()
        .then((user) => {
            bcrypt.compare(userData.password, user[0].password)
            .then((res) => {
                if(res === true){
                    user[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});  //update loginHistory
                    //update User object with user[0] data
                    User.update({userName: user[0].userName},
                    { $set: { loginHistory: user[0].loginHistory} },
                    {multi: false})
                    .exec()
                    .then(() => resolve(user[0]))
                    .catch((err) => reject("There was an error verifying the user: " + err));
                }
                else
                    reject("Incorrect Password for user: " + userData.userName);
            })
            .catch((err) => reject("Incorrect Password for user: " + userData.userName));   
        })
        .catch(() => reject("Unable to find user: " + userData.userName));
    });
}
