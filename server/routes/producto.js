const express = require('express');
const _ = require('underscore');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');


// Obtener todos los productos

app.get('/productos', verificaToken, (req, res) => {

    //trae todos los productos: usuario y categoria
    //Paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);


    Producto.find({ disponible: true })
        .sort('nombre')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre estado role email')
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
            });
        });


});

// Obtener un producto por ID

app.get('/productos/:id', verificaToken, (req, res) => {
    //populate: usuario y categoria
    //paginado
    let id = req.params.id;


    Producto.findById(id)
        .populate('usuario', 'nombre estado role email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB.disponible) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }

            res.json({
                ok: true,
                productoDB
            })
        });

});

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
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
        });
});

// Crea un nuevo producto

app.post('/productos', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUnitario,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {

            return res.status(400).json({
                ok: false,
                err
            })

        }

        res.json({
            ok: true,
            producto: productoDB
        })
    });
});

// Actualiza un producto

app.put('/productos/:id', (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado

    let id = req.params.id;
    let body = req.body;
    let updateCategoria = {
        nombre: body.nombre,
        precioUni: body.precioUnitario,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: body.usuario
    }
    Producto.findByIdAndUpdate(id, updateCategoria, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});


// Borrar un producto: Disponible pase a falso del producto

app.delete('/productos/:id', verificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado

    let id = req.params.id;

    let cambiaEstado = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado para ser borrado'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Producto borrado satisfactoriamente'
        });
    });

});

module.exports = app;