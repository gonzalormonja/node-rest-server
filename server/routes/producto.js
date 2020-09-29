const express = require('express');
const _ = require('underscore');
let { verificaToken } = require('../middlewares/authenticacion');

let app = express();
let Producto = require('../models/producto');

// ============================
// Buscar productos 
// ============================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    //expresion regular
    let regEx = new RegExp(termino, 'i'); //i es no case sensitive
    Producto.find({ nombre: regEx, disponible: true })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            })
        })
});

// ============================
// Obtener todos los productos 
// ============================
app.get('/productos', verificaToken, (req, res) => {
    //trae todos los productos con la categoria y el usuario
    //paginar
    let desde = req.params.desde || 0;
    let limite = req.params.limite || 5;
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                productos
            })
        })


});

// ============================
// Obtener un producto por ID 
// ============================
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id, (err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBD) {
            res.status(400).json({
                ok: false,
                err: {
                    message: "El ID no existe"
                }
            })
        }
        return res.json({
            ok: true,
            producto
        });
    })
});

// ============================
// Crear un producto 
// ============================
app.post('/productos', verificaToken, (req, res) => {
    //grabar usuario
    //grabar categoria
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: body.usuario
    });
    producto.save((err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        return res.status(201).json({
            ok: true,
            producto: productoBD
        });
    })
});

// ============================
// Actualizar un producto 
// ============================
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria']);
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' })
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "El ID no existe"
                    }
                })
            }
            return res.json({
                ok: true,
                producto: productoBD
            })
        })
});

// ============================
// Borrar un producto 
// ============================
app.delete('/productos/:id', verificaToken, (req, res) => {
    //no borrar fisicamente, solamente poner disponible en false
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, { disponible: false }, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            productoBD
        })
    })
})

module.exports = app;