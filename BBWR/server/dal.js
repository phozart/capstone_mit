const db = require("./model");
const User = db.user;
const dbConfig = require ("./db.config");
const config = require("./config/auth");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log("Successfully connect to MongoDB.");
  
        
      })
      .catch(err => {
        console.error("Connection error", err);
        process.exit();
      });


exports.validateCreate = (customerName, email, role) => { 

  
    }
// 
function signup (customerName, email, password, role) { 
  const user = new User({
    
    customerName: String(customerName),
    email: String(email),
    role: String(role),
    balance: 0,
    password: bcrypt.hashSync(password, 8)
    
  });
  return user;
    } 

function checkDuplicate(email){
  return new Promise((resolve, reject)=> {
    const em = String(email);
    User.findOne({email: em})
    .then((user) => {
    if(!user) resolve(0);
    resolve(1)
    console.log(email)
      
      
    })
 
});
}
// create user account
function create(user){
  return new Promise((resolve, reject) => {
    
      const customer = new User(user);
      customer.save((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      })
    
  });
}

//login refactored
function logIn (myemail, password)  {
  return new Promise ((resolve, reject) => {
    var cust = '';
    var usertoken = {};
    let encrypted =  bcrypt.hashSync(password);
    const user = User.findOne({email: myemail })
      .then((doc) => {
        if(!doc)
        resolve( {
          id: '0',
          customerName: 'NOT FOUND',
          email: 'NOT FOUND',
          role: '',
          accessToken: '1'
        });
        usertoken = doc;
       
        bcrypt.compare(password, doc.password,
        function (err, isMatch)
        {
          if (isMatch) {
            var user = { customerName: doc.customerName, email: doc.email, role: doc.role };
            var token =  jwt.sign(user, config.secret, {
              expiresIn: 86400 // 24 hours
            });
            
            var ret = {
              id: doc.id,
              customerName: doc.customerName,
              email: doc.email,
              role: doc.role,
              accessToken: token,
              balance: doc.balance
            };
            
            resolve(ret);
            return  ret;
            
          }
          if(!isMatch) {
            resolve ({
              accessToken: null,
              message: "Invalid Password!"})
          }
          
        }
     

        )
      } 
      )
      
      .catch((err) => reject(err))});
    }



    function logInGoogle (myemail)  {
      return new Promise ((resolve, reject) => {
        var cust = '';
        var usertoken = {};
       
        const user = User.findOne({email: myemail })
          .then((doc) => {
            if(!doc)
            resolve( {
              id: '0',
              customerName: 'NOT FOUND',
              email: 'NOT FOUND',
              role: '',
              accessToken: '1'
            });
            usertoken = doc;
           
            if (doc && doc.role === 'ouser') {
                var user = { customerName: doc.customerName, email: doc.email, role: 'user' };
                var token =  jwt.sign(user, config.secret, {
                  expiresIn: 86400 // 24 hours
                });
                
                var ret = {
                  id: doc.id,
                  customerName: doc.customerName,
                  email: doc.email,
                  role: doc.role,
                  accessToken: token,
                  balance: doc.balance
                };
                resolve(ret);
                return  ret;
              }else {
                return {customerName: 'noGoogle'}
              }
              
              })
          })
          
          .catch((err) => reject(err))
        }
      
//Get 
    
// update - deposit/withdraw amount
function updateBalance(email, amount){
const amo = Number(amount);
  return new Promise((resolve, reject) => {  
 
          User          
          .findOneAndUpdate(
              {email: email},
              { $inc: { balance: amo}},
              { returnOriginal: false },
              function (err, documents) {
                  err ? reject(err) : resolve(documents);
              }
          );            


  });    
}

function getBalance(email){
      return new Promise((resolve, reject) => {    
        const user = User.findOne({email: email })
          .then((doc) => {
     if(doc){
        var ret = {
          id: doc.id,
          customerName: doc.customerName,
          email: doc.email,
          role: doc.role,
          balance: doc.balance
        };
        resolve(ret);
        return(ret);
      }else{
        resolve( {
          id: '0',
          customerName: 'NOT FOUND',
          email: 'NOT FOUND',
          role: '',
          balance: 0
        });
      }
      
    })
}  )}


// all users
function all(){
  return new Promise((resolve, reject) => {    
          const allUsers = User.find({})
          .then(
            (users) => {
         resolve(users);
              return users;
            }
          )
          
              
  })
}
function allEmail(){
  return new Promise((resolve, reject) => {    
          const allUsers = User.find({})
          .then(
            (users) => {
              let arr = [];
              users.forEach(element => arr.push(element.email))
         resolve(arr);
              return arr;
            }
          )
          
              
  })
}

      
module.exports = {create, signup, logIn, updateBalance, all, checkDuplicate, logInGoogle, getBalance,allEmail };
