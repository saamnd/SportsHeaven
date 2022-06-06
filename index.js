const  express=require('express')
const PORT = process.env.PORT || 8080
const bodyParser = require('body-parser')
const session = require('express-session')
//const db = require('./dao/models')
//const usuario = require('./dao/models/usuario')
const app = express()



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
})) 

app.use(express.static('assets'))
app.set('view engine','ejs')
app.use(session({
    secret : "sam",
    resave : false,
    saveUninitialized : false
}))


app.get('/', (req, res) => {
    res.render('inicio')
  })

app.get('/registro', (req, res) => {
    res.render('registro')
  })



app.listen(PORT,()=>{
    console.log(`El servidor se inicio en el puerto: ${PORT}`)
})
 
 