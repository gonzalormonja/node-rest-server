const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/authenticacion');
const _ = require('underscore');

const app = express();

app.get('/usuario', verificaToken, (req, res) => {

    //esto viene por el middleware verificaToken
    // return res.json({
    //     usuario: req.usuario
    // });

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite)

    Usuario
        .find({ estado: true }, 'nombre email role estado img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    count: conteo
                });
            });
        });

});
app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });


    })
});
app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});
app.delete('/usuario/:idUsuario', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.idUsuario;

    //borrado fisico
    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    //borrado virtual
    Usuario.findByIdAndUpdate(id, { 'estado': false }, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: "Usuario no encontrado"
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    })

});

module.exports = app;