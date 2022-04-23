const jwt = require("jsonwebtoken");
const config = require("./config/auth.js");
const db = require("./model");
const User = db.user;
const Role = db.role;

//VERIFY TOKEN ==========================
function verifyToken (token, userId)  {
  return new Promise((resolve, reject) => {
    console.log(token);
    if (!token)
      resolve('no token');
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        resolve({ message: "Unauthorized!" });
        console.log('it 2');
      }
            if (userId == decoded.id);{
              console.log(decoded.id);
              console.log(userId);

            }
      resolve('user');
      console.log('it 3');
      resolve('problem');
    })
    .catch((err) => reject(err));
  
  }

  )
  
 
}


//IS ADMIN ==========================
function isAdmin  (userId)  {
  return new Promise((resolve, reject) => {
  User.findById(userId)
  .exec((err, user) => {
    if (err) {
      reject(status(500).send({ message: err }));
    }
      if (user.role === "admin") {
           resolve('admin')
          }
        })
        .catch((err) =>{
          reject(status(403).send({ message: "Require Admin Role!" }));
        })

  });
};



module.exports = { verifyToken, isAdmin};