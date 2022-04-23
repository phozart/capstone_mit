var express = require('express');
var app = express();
var cors = require('cors');
const db = require('./server/dal.js');
//const { verifyToken, isAdmin } = require("./server/authJwt");
const config = require("./server/config/auth.js");


const jwt = require("jsonwebtoken");

//app.use(express.static('./public'));
app.use(cors());
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.get("/", (req, res) => {
    res.json({ message: "Welcome " });
  });

  
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //VERIFY TOKEN ==========================
function authenticate (req, res, next)  {
        const authHeader = req.headers['authorization'];
      
        const token = authHeader && authHeader.split(' ')[1];
      if (token == null) return res.sendStatus(401)
      jwt.verify(token, config.secret, (err, user) => {
        if (err) {
          return res.sendStatus(403);
         
        }
        
        req.user = user;
        next();
      })
 
  }

  //ROUTES =============================================
  app.post('/posts', authenticate, (req,res) => {
    console.log(req.user); 
    res.send(req.user);
  })


  app.get("/api/role/all", (req, res) => res.send('public'));

  app.get("/api/role/user/", authenticate, (req, res) => {
        if (req.user.email) return res.send(req.user);
          else  res.send('User not authenticated');
            
  });
  app.get("/api/role/admin", authenticate, (req, res) => {
        
        if (req.user && req.user.role === 'admin') return res.send(req.user);
        else res.send('No Admin privileges');
    }
    
  );


  //SIGN UP
  app.post(
    "/api/auth/signup",  function(req,res)  {
     
        try {
         
                const customerName = String(req.body.customerName);
                const email = String(req.body.email);
                const password = String(req.body.password);
                const role = String(req.body.role);
               const user = db.signup(customerName, email, password, role);
               
             db.checkDuplicate(user.email)
             .then((dupRes) => {
            
              if(dupRes== 1) return res.send({ Message: '2' }) 
              if(dupRes ==0) {
                db.create(user);
                res.send({ Message: '1' });    
              }  else{
              res.send({Message: '0'});
            }
             }

             )
               
    }
    catch (err)
    {
        console.log(err);
    }
    
});
  app.get("/api/auth/signin/:email/:password", async  function (req,res)  {
    const result =  await db.logIn(req.params.email,req.params.password);
    // console.log("this is the return to servezr: " + JSON.stringify(result.email) + "============");
   console.log('server data: ' + JSON.stringify(result) + '=====end')
     res.json(result);
});
app.get("/api/auth/signingoogle/:email", async  function (req,res)  {
  const result =  await db.logInGoogle(req.params.email);
   //console.log("this is the return to servezr: " + JSON.stringify(result.email) + "============");
 console.log('server data: ' + JSON.stringify(result) + '=====end')
   res.json(result);
});

//all accounts
app.get('/api/account/all', function (req, res){
  
    const docs =db.all()
    .then((docs) => {
 
        res.json(docs)})
    })

app.get('/api/balance/get/:email',  function (req,res) {
  db.getBalance(req.params.email)
.then((doc) => res.json(doc))
  
})

app.get('/api/balance/update/:email/:money', authenticate,  function (req,res) {
  const result = db.updateBalance(req.params.email, req.params.money);

  res.json(result);
})

app.get('/api/all/email', function (req, res){
  
  const docs =db.allEmail()
  .then((docs) => {

      res.json(docs)})
  })







var port = 3001;
app.listen(port);
console.log('Running on port: ' + port);