const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenPorUrl } = require('../middlewares/authenticacion');

const app = express();

// ============================
// TIPOS VALIDOS
// ============================
const tipos = ['productos', 'usuarios'];


app.get('/img/:tipo/:img', verificaTokenPorUrl, (req, res) => {
    let tipo = req.params.tipo;
    if (tipos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "Los tipos permitidos son " + tipos.join(', '),
                tipo: tipo,
            }
        })
    }

    let img = req.params.img;
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/img/no-image.jpg');
        res.sendFile(noImagePath);
    }
});

module.exports = app;