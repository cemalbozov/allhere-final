const express = require("express")
var methodOverride = require('method-override')
const app = express()
const bodyParser = require('body-parser')
const expressSession = require("express-session")
const hbs = require("./hbs")
//const MongoStore = require('connect-mongo')(expressSession)
const cloudinary = require('cloudinary').v2
const fileUpload = require("express-fileupload")
const dotenv = require("dotenv")

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key:process.env.CLOUD_API_KEY,
  api_secret:process.env.CLOUD_API_SECRET 
})

//mongoose connection was here

  

app.use(fileUpload({useTempFiles:true}))

app.use(expressSession({
  secret: 'bozov',
  resave: true,
  saveUninitialized: true,
  // store: new MongoStore({ mongooseConnection: mongoose.connection })
}))



app.use((req, res, next) => {
  const userId = req.session.userId
  if (userId) {
    res.locals = {
      displayLink: true
    }
  }
  else {
    res.locals = {
      displayLink: false
    }
  }
  next()
})

app.use((req, res, next) => {
  res.locals.sessionFlash = req.session.sessionFlash
  delete req.session.sessionFlash
  next()
})

app.use(express.static('public'))

app.use(methodOverride('_method'))

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const main = require("./routes/main")
const users = require("./routes/users")
const account = require("./routes/account")
const admin = require("./routes/admin")

app.use("/", main)
app.use("/users", users)
app.use("/account", account)
app.use("/admin", admin)





app.listen(3000);