const express = require('express');
const router = express.Router();

router.get('/nosotros', async (req, res) => {
    res.render('nosotros',{
        rol: req.session.rol,
        nombre: req.session.nombre})
})
module.exports = router;