const  express= require('express')
const PORT = process.env.PORT || 8080
const bodyParser = require('body-parser')
const session = require('express-session')
const db = require('./dao/models')
//const usuario = require('./dao/models/usuario')
const app = express()

const path = require('path');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:true
})) 

app.use(express.static('assets'))
app.set('view engine','ejs')
app.use(session({
    secret : "sam",
    resave : false,
    saveUninitialized : false, 
    cookie: { maxAge: 24 * 60 * 60000 },
}))

///////
const nosotrosRouter=require('./dao/routes/nosotros');
app.use('/',nosotrosRouter);

const logoutR=require('./dao/routes/logout');
app.use('/',logoutR);

app.get('/', (req, res) => {
    res.render('inicio',{
        rol: req.session.rol,
        usuario: req.session.usuario,
        nombre: req.session.nombre     
    })
  })

app.get('/registro', async (req, res) => {
    if(req.session.rol != undefined){
        res.redirect('/')
    }
    else{
    res.render('registro',{
        rol: req.session.rol,
        nombre: req.session.nombre})}
  })

app.post('/registro', async (req, res)=>{
    const erol = req.body.nrol
    const ecorreo = req.body.ncorreo
    const enombre = req.body.nnombre
    const eapellido = req.body.napellido
    const efecha = req.body.nfecha //no dejar fecha vacia
    const econtra = req.body.ncontra
    const econtra2 = req.body.ncontra2

    if (await db.Usuario.findOne({
        where: {correo: ecorreo}}) != undefined) {
            error = "0"
            console.log("Correo ya registrado")
            res.render('errorregistro', {error: error})
    }else{
        if(econtra != econtra2){
            error = "1"
            console.log("Contraseñas no coinciden")
            res.render('errorregistro', {error: error})
        }
        else{
            await db.Usuario.create({
                rol: erol,
                nombre: enombre,
                apellido: eapellido,
                correo: ecorreo,
                password: econtra,
                fechan: efecha,
            })
            res.redirect('/')
        }
    }
    
})

app.get('/login', (req,res) => {
    if(req.session.rol != undefined){
        res.redirect('/')
    }
    else{
    res.render('login',{
        rol: req.session.rol,
        nombre: req.session.nombre})}
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
    console.log('usuario', usuarioA)
    if(usuarioA!= null){
        if(usuarioA.password == passwordA){
            console.log("Credenciales correctas")
            req.session.rol = usuarioA.rol
            req.session.nombre = usuarioA.nombre
            req.session.apellido = usuarioA.apellido
            req.session.correo = usuarioA.correo
            console.log("sesion rol: ", req.session.rol)
            console.log("sesion nombre: ", req.session.nombre)
            console.log("sesion apellido: ", req.session.apellido)
            console.log("sesion correo: ", req.session.correo)
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

/*app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
    console.log("Se cerró la sesión")
})*/

app.get('/listadoEventos', async(req, res) => {
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin

    if (dif >= 3 * 60 * 60 * 1000) {
        req.session.destroy() // Destruyes la sesion
        res.render('/inicio',{
            rol: req.session.rol,
            nombre: req.session.nombre})
    }else {
        // Obtener torneos de la base de datos
        const eventos = await db.Evento.findAll({
            order : [
                ['id', 'DESC']
            ]
        });
        // begin changes
    const totalAsistentesEventos = await db.UsuarioEvento.findAll({
        attributes: [
            'id_evento',
            [
                db.sequelize.fn('COUNT', db.sequelize.col('id')),
                'total_asistentes',
            ],
        ],
        group: ['id_evento'],
        raw: true,
    })
    const [results] = await db.sequelize.query(
        'SELECT UE.*,U.nombre, U.apellido FROM "UsuarioEvento" UE LEFT JOIN "Usuario" U ON U.id = UE.id_usuario'
    )
    const usuarioEventos = {}
    for (const result of results) {
        if (!usuarioEventos[result.id_evento]) {
            usuarioEventos[result.id_evento] = [
                { nombre: result.nombre, apellido: result.apellido },
            ]
        } else {
            usuarioEventos[result.id_evento].push({
                nombre: result.nombre,
                apellido: result.apellido,
            })
        }
    }
    // end changes
        let nuevaListaEventos = []
        for (let evento of eventos) {
            const { total_asistentes: totalAsistentes } =
            totalAsistentesEventos.find((uE) => uE.id_evento === evento.id) ??
            {}
            nuevaListaEventos.push({
                id : evento.id,
                nombre : evento.nombre,
                fecha : evento.fecha,
                hora : evento.hora,
                ubicacion : evento.ubicacion,
                descripcion : evento.descripcion,
                totalAsistentes: totalAsistentes ?? 0,
                asistentes: usuarioEventos[evento.id] ?? [],
            })
        }

        res.render('listadoEventos', {
            eventos : nuevaListaEventos,
            rol: req.session.rol,
            nombre: req.session.nombre
        })
    }
        
})

app.get('/listacurso', async(req, res) => {
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin

    if (dif >= 3 * 60 * 60 * 1000) {
        req.session.destroy() // Destruyes la sesion
        res.render('/inicio',{
            rol: req.session.rol,
            nombre: req.session.nombre})
    }else {
        // Obtener cursos de la base de datos
        const cursos = await db.Curso.findAll({
            order : [
                ['id', 'DESC']
            ]
        });
        
        let nuevaListaCursos = []
        for (let curso of cursos) {
            nuevaListaCursos.push({
                id : curso.id,
                nombre : curso.nombre,
                deporte : curso.deporte,
                descripcion :curso.descripcion,
                precio : curso.precio,
                calificacion : curso.calificacion
            })
        }

        res.render('listacurso', {
            cursos : nuevaListaCursos,
            rol: req.session.rol,
            nombre: req.session.nombre
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

app.get('/listacurso/modificarcursos/:id', async (req, res) => {
    const idCurso = req.params.id

    const curso = await db.Curso.findOne({
        where : {
            id : idCurso
        }
    })

    res.render('modificarcursos', {
        curso : curso,
        rol: req.session.rol,
        nombre: req.session.nombre
    })
})

app.post('/listacurso/modificarcursos', async (req, res) => {
    const idCurso = req.body.curso_id
    const nombre = req.body.curso_nombre
    const deporte = req.body.curso_deporte
    const descripcion = req.body.curso_descripcion
    const precio = req.body.curso_precio

    const curso = await db.Curso.findOne({
        where : {
            id : idCurso
        }
    })
    curso.nombre = nombre
    curso.deporte = deporte
    curso.descripcion = descripcion
    curso.precio = precio


    await curso.save()

    res.redirect('/listacurso')

})

app.get('/cursos', (req, res) => {
    res.render('crearcursos',{
        rol: req.session.rol,
        nombre: req.session.nombre})
  })

  app.post('/curso/Unirse', async (req, res) => {
    if (!req.session.usuario) {
        return res.json({ success: false })
    }
    const userId = req.session.usuario.id
    const cursoId = req.body.id
    const curso = await db.Curso.findOne({
        where: { id: cursoId },
        raw: true,
    })

    if (curso.fecha < new Date()) {
        return res.json({ success: false, code: 'OLD_EVENT' })
    }
    const usuarioCurso = await db.UsuarioCurso.findOne({
        where: { id_usuario: userId, id_curso: cursoId },
    })
    if (!usuarioCurso) {
        await db.UsuarioCurso.create({
            id_usuario: userId,
            id_curso: eventoId,
            created_at: new Date(),
            updated_at: new Date(),
        })
        res.json({ success: true, code: 'ADDED' })
    } else {
        res.json({ success: false, code: 'DUPLICATED' })
    }
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

app.get('/evento/new', (req, res) => {
    res.render('crearEvento',{
        rol: req.session.rol,
        nombre: req.session.nombre})
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
// BEGIN CHANGES

app.post('/evento/unirse', async (req, res) => {
    if (!req.session.usuario) {
        return res.json({ success: false })
    }
    const userId = req.session.usuario.id
    const eventoId = req.body.id
    const evento = await db.Evento.findOne({
        where: { id: eventoId },
        raw: true,
    })

    if (evento.fecha < new Date()) {
        return res.json({ success: false, code: 'OLD_EVENT' })
    }
    const usuarioEvento = await db.UsuarioEvento.findOne({
        where: { id_usuario: userId, id_evento: eventoId },
    })
    if (!usuarioEvento) {
        await db.UsuarioEvento.create({
            id_usuario: userId,
            id_evento: eventoId,
            created_at: new Date(),
            updated_at: new Date(),
        })
        res.json({ success: true, code: 'ADDED' })
    } else {
        res.json({ success: false, code: 'DUPLICATED' })
    }
})

// END CHANGES
app.get('/listadoEventos/modificareventos/:id', async (req, res) => {
    const idEvento = req.params.id

    const evento = await db.Evento.findOne({
        where : {
            id : idEvento
        }
    })

    res.render('modificareventos', {
        evento : evento,
        rol: req.session.rol,
        nombre: req.session.nombre
    })
})

app.post('/listadoEventos/modificareventos', async (req, res) => {
    const idEvento = req.body.evento_id
    const nombre = req.body.evento_nombre
    const fecha = req.body.evento_fecha
    const hora = req.body.evento_hora
    const ubicacion = req.body.evento_ubicacion
    const descripcion = req.body.evento_descripcion

    const evento = await db.Evento.findOne({
        where : {
            id : idEvento
        }
    })
    evento.nombre = nombre
    evento.fecha = fecha
    evento.hora = hora
    evento.ubicacion = ubicacion
    evento.descripcion = descripcion


    await evento.save()

    res.redirect('/listadoEventos')

})

app.get('/listadoEventos/eliminar/:id', async (req, res) => {
    const evento = req.params.id
    await db.Evento.destroy({
        where : {
            id : evento
        }
    })
    res.redirect('/listadoEventos')
})
 

app.get('/inicio', (req, res) => {
    res.render('inicio',{
        rol: req.session.rol,
        nombre: req.session.nombre})
})

app.get('/perfil', async(req, res) => {
    const eventos = await db.Evento.findAll({
        order : [
            ['id', 'DESC']
        ]
    });
    
    let nuevaListaEventos = []
    for (let evento of eventos) {
        nuevaListaEventos.push({
            id : evento.id,
            nombre : evento.nombre,
            fecha : evento.fecha,
            hora : evento.hora,
            ubicacion : evento.ubicacion,
            descripcion : evento.descripcion
        })
    }
    const cursos = await db.Curso.findAll({
        order : [
            ['id', 'DESC']
        ]
    });
    
    let nuevaListaCursos = []
    for (let curso of cursos) {
        nuevaListaCursos.push({
            nombre : curso.nombre,
            deporte : curso.deporte,
            descripcion :curso.descripcion,
            precio : curso.precio,
            calificacion : curso.calificacion
        })
    }
    res.render('perfil',{
        rol: req.session.rol,
        nombre: req.session.nombre,
        apellido: req.session.apellido,
        correo: req.session.correo,
        eventos : nuevaListaEventos,
        cursos : nuevaListaCursos,
    })
})

app.get('/busqueda', (req, res) => {
    res.render('busqueda',{
        rol: req.session.rol,
        nombre: req.session.nombre     
    })
  })

  app.post('/busqueda', async (req, res)=>{
    const amigo = req.body.amigo

    const usuario = await db.Usuario.findOne({
        where: {
            nombre: amigo
        }
    })
    if(usuario !=null){
        res.render('perfil2',{
            rol: req.session.rol,
            nombre: req.session.nombre,
            nombreA: usuario.nombre,
            apellidoA: usuario.apellido,
            correoA: usuario.correo,
        })
    }
    else{
        error = "1"
        console.log("No se encontró el usuario")
        res.render('errorbusqueda',{
            rol: req.session.rol,
            nombre: req.session.nombre})
    }
    
})

app.get('/perfil2', async(req, res) => {
  
    res.render('perfil2',{
        rol: req.session.rol,
        nombre: req.session.nombre,
        apellido: req.session.apellido,
        correo: req.session.correo,
    })
})

app.listen(PORT,()=>{
    console.log(`El servidor se inicio en el puerto: ${PORT}`)
})


 