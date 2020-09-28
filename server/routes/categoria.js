const express = require('express');
const _ = require('underscore');
let { verificaToken, verificaAdminRole } = require('../middlewares/authenticacion');

let app = express();

let Categoria = require('../models/categoria');

// ============================
//  Mostrar todas las categorias
// ============================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        //ordena en forma ascendente por defecto
        .sort('descripcion')
        //populate trae los datos como "join"
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                categorias
            })
        });
});

// ============================
// Mostrar una categoria por ID 
// ============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id).exec((err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaBD) {
            res.json({
                ok: false,
                categoria: "categoria no encontrada"
            })
        }
        return res.json({
            ok: true,
            categoria: categoriaBD
        })
    });
});

// ============================
// Crear nueva categoria 
// ============================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria();

    categoria.descripcion = body.descripcion;
    categoria.usuario = req.usuario._id;
    categoria.save((err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaBD
        })
    });
});

// ============================
//  Actualizar categoria
// ============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descrCate = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, descrCate, { new: true, runValidators: true, context: "query" }, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria
        })

    });
});

// ============================
// Borrar una categoria 
// ============================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    Categoria.findOneAndDelete(id, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaBD
        })
    })
})

module.exports = app;