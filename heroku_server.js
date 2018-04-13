var pem = require('pem')
var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var app = express()
const PORT = process.env.PORT || 5000

// Own Modules
var get_ipwifi = require('./modules/get_ipwifi.js')
var ip = get_ipwifi.getIPwifi()
// var db = require('./db_server.js')

app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
app.engine('html', require('ejs').renderFile) //support for res.render()
app.use(cookieParser()) // support for req.cookies

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'secretjs',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.get('/', function (req, res) {
  res.sendFile(__dirname+'/view/main.html')
})

app.get('/login', function (req, res) {
  res.render(__dirname+"/view/login.html", {ip : ip, protocol : protocol, port : port})
})

app.post('/login', function (req, res) {
  console.log('[server app.post /login] username: '+req.body.username)
  console.log('[server app.post /login] password: '+req.body.password)
  function checkLogin(check, session){
    if(check){
      console.log(session)
      res.cookie('session', session, { maxAge: 1000 * 60}) // 1 minute
      res.redirect(protocol+'://'+ip+':'+port+'/home')
    }else{
      res.redirect(protocol+'://'+ip+':'+port+'/login')
    }
  }
  db.checkLogin(req.body.username, req.body.password, req.sessionID, checkLogin)
})

app.get('/home', function(req,res){
  if(Object.keys(req.cookies).length == 0 || !('session' in req.cookies))
    res.redirect(protocol+'://'+ip+':'+port+'/login')
  else{
    function checkSesion(check){
      if(check)
        res.render(__dirname+"/view/home.html", {ip:ip})
      else
        res.redirect(protocol+'://'+ip+':'+port+'/login')
    }
    db.checkSession(req.cookies['session'], checkSesion)
  }
})

app.get('/scanqr',function(req,res){
	res.render(__dirname+"/view/scanqr.html", {ip:ip})
})

app.get('/genqr',function(req,res){
	res.render(__dirname+"/view/genqr.html", {ip:ip})
})

app.post('/genqr',function(req,res){
	res.render(__dirname+"/view/qrcode.html", {ip:ip})
})


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))