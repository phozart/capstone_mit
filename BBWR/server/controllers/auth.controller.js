const config = require("./../config/auth");
const db = require("./../model");
const User = db.user;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


    


exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      var authorities = [];
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      
      res.status(200).send({
        id: user._id,
        customerName: user.customerName,
        email: user.email,
        role: authorities,
        accessToken: token
      });
    });
};

