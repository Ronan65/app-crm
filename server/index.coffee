express = require 'express'
http = require 'http'
https = require 'https'
passport = require 'passport'
path = require 'path'
CORS = require 'w3c-cors'
customers =  require __dirname + '/modules/customers'
User = require __dirname + '/modules/users/users.coffee'
ejs = require 'ejs'
fs = require 'fs'

options =
  key: fs.readFileSync("ssl/server.key")
  ca: fs.readFileSync("ssl/server.csr")
  cert: fs.readFileSync("ssl/server.crt")


app = express();

app.configure ->
	app.use express.bodyParser(
		keepExtensions: true
		uploadDir: __dirname + "/data"
	)
	app.set('views','../client/views')
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'html')
	app.use(express.logger('dev'))
	app.use(express.cookieParser())
	app.use(express.methodOverride())
	app.use(express.static(path.join('../client')))
	app.use(express.cookieSession({secret: process.env.COOKIE_SECRET || "Superdupersecret"}))
	app.use(express.methodOverride())
	app.use(passport.initialize())
	app.use(passport.session())

app.use CORS ->
    require __dirname + '/etc/CORS.json'

passport.use(User.localStrategy)

passport.serializeUser(User.serializeUser)
passport.deserializeUser(User.deserializeUser)

require('./routes/routes.js')(app)
http.createServer(app).listen 3000
https.createServer(options, app).listen 8443