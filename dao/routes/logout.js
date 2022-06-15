const express = require('express');
const router = express.Router();
//LOGOUT

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
    console.log("Se cerró la sesión")
})

module.exports = router;