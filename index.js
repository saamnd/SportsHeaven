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

app.get('/registro', async (req, res) => {
    res.render('registro')
  })

app.post('/registro', async (req, res)=>{
    const erol = req.body.nrol
    const ecorreo = req.body.ncorreo
    const enombre = req.body.nnombre
    const eapellido = req.body.napellido
    const efecha = req.body.nfecha 
    const econtra = req.body.ncontra
    const econtra2 = req.body.ncontra2
    const fechann = efecha.slice(0,4)

    if (await db.Usuario.findOne({
        where: {correo: ecorreo}}) != undefined) {
            res.render('error')
    }else{
        await db.Usuario.create({
            rol: erol,
            nombre: enombre,
            apellido: eapellido,
            correo: ecorreo,
            contra: econtra,
            fecha: efecha
        })
        res.redirect('/')
    }
    
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

app.get('/listadoEventos', async(req, res) => {
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin

    if (dif >= 3 * 60 * 60 * 1000) {
        req.session.destroy() // Destruyes la sesion
        res.render('/inicio')
    }else {
        // Obtener torneos de la base de datos
        const eventos = await db.Evento.findAll({
            order : [
                ['id', 'DESC']
            ]
        });
        
        let nuevaListaEventos = []
        for (let evento of eventos) {
            nuevaListaEventos.push({
                nombre : evento.nombre,
                fecha : evento.fecha,
                hora : evento.hora,
                ubicacion : evento.ubicacion,
                descripcion : evento.descripcion
            })
        }

        res.render('listadoEventos', {
            eventos : nuevaListaEventos
        })
    }
        
})

app.post('/cursos', async (req, res)=>{
    const nnombre = req.body.nombre
    const ndeporte = req.body.deporte
    const ndescripcion = req.body.descripcion
    const nprecio = req.body.precio
    const ncalificacion = req.body.calificacion
    const nprofesor = req.body.profesor
    
    await db.Curso.create({
        nombre: nnombre, //los primeros son como estan en models> curso.js
    	deporte: ndeporte,
        descripcion: ndescripcion,
        precio: nprecio,
        calificacion: ncalificacion,
        profesor: nprofesor
    })
    res.redirect('/listacurso')
})

app.post('/modificar', async(req,res)=>{
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
    
    res.redirect('/listacurso')
})

app.get('/modificar', async (req, res) => {
    const cursos = await db.Curso.findAll({
        order : [
            ['id', 'ASC']
        ]
    });

    res.render('modificarcursos', {
        cursos : cursos
    })
})

app.get('/modificar', (req, res) => {
    res.render('modificarcursos')
  })

app.get('/cursos', (req, res) => {
    res.render('crearcursos')
  })


app.get('/listacurso/eliminar/:id', async (req, res) => {
    const curso = req.params.id
    await db.Curso.destroy({
        where : {
            id : curso
        }
    })
    res.redirect('/listacurso')
})

app.get('/listacurso', async (req, res) => {
    const cursos = await db.Curso.findAll({
        order : [
            ['id', 'ASC']
        ]
    });

    res.render('listacurso', {
        cursos : cursos
    })
})

app.get('/evento/new', (req, res) => {
    res.render('crearEvento')
})

app.post('/evento/new', async (req, res) => {
    const eventoNombre = req.body.nombre
    const eventoFecha = req.body.fecha
    const eventoHora = req.body.hora
    const eventoUbicacion = req.body.ubicacion
    const eventoDescripcion = req.body.descripcion

    await db.Evento.create({
        nombre : eventoNombre,
        fecha : eventoFecha,
        hora : eventoHora,
        ubicacion : eventoUbicacion,
        descripcion : eventoDescripcion,
    })

    res.redirect('/listadoEventos')
})


app.get('/inicio', (req, res) => {
    res.render('inicio')
})

app.listen(PORT,()=>{
    console.log(`El servidor se inicio en el puerto: ${PORT}`)
})
 
 