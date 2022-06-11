const  express=require('express')
const PORT = process.env.PORT || 8080
const bodyParser = require('body-parser')
const session = require('express-session')
const db = require('./dao/models')
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

app.get('/login', (req,res) => {
    if(req.session.rol != undefined){
        res.redirect('/')
    }
    else{
    res.render('login')}
})

app.post('/login', async (req, res) => {
    const correoA = req.body.correoU
    const passwordA = req.body.passwordU
    usuarioA = null
  
    const Usuarios = await db.Usuario.findAll()
    
    Usuarios.forEach((usuario) =>{
        if(usuario.correo == correoA){
                usuarioA = usuario
            }
    })

    if(usuarioA!= null){
        if(usuarioA.password == passwordA){
            console.log("Credenciales correctas")
            req.session.rol = usuarioA.rol
            req.session.nombre = usuarioA.nombre
            console.log("sesion rol: ", req.session.rol)
            console.log("sesion nombre: ", req.session.nombre)
            res.redirect('/')
        }
        else{
            const error = "0"
            console.log("Contraseña incorrecta")
            res.render('errorlogin', {error: error})
        }}
        else{
            error = "1"
            console.log("No se encontró el usuario")
            res.render('errorlogin', {error: error})
        }
        
})

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
    console.log("Se cerró la sesión")
})

app.get('/listadoEventos', (req, res) => {
    res.render('listadoEventos')
  })


app.post('/cursos/new', async (req, res)=>{
    const nnombre = req.body.nuevonombre
    const ndeporte = req.body.nuevodeporte
    const ndescripcion = req.body.nuevodescripción
    const nprecio = req.body.nuevoprecio
    const ncalificacion = req.body.nuevocalificacion
    const nprofesor = req.body.nuevoprofesor
    
    await db.Curso.create({
        nombre: nnombre, //los primeros son como estan en models> curso.js
    	deporte: ndeporte,
        descripcion: ndescripcion,
        precio: nprecio,
        calificacion: ncalificacion,
        profesor: nprofesor
    })
    res.redirect('/cursos')
})

app.post('/cursos/modificar', async(req,res)=>{
    const id = req.body.curso_id
    const nnombre = req.body.nuevonombre
    const ndeporte = req.body.nuevodeporte
    const ndescripcion = req.body.nuevodescripcion
    const nprecio = req.body.nuevoprecio
    const nprofesor = req.body.nuevoprofesor
    

    //Obtener un curso de la bd con id: idCurso
    const curso = await db.Curso.findOne({
        where: {
            id: idCurso
        }
    })

    //Cambiar sus propiedades/ campos
    curso.nombre = nnombre
    curso.deporte = ndeporte,
    curso.descripcion = ndescripcion,
    curso.precio = nprecio,
    curso.profesor = nprofesor
    
    // Guardo/Actualizo en la bd
    await curso.save()
    
    res.redirect('/cursos')
})

app.listen(PORT,()=>{
    console.log(`El servidor se inicio en el puerto: ${PORT}`)
})
 
 