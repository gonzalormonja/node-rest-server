require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

//parsear body a json(sirve para los envios de formularios)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//habilitar la carpeta public
//path.resolve soluciona el conflicto por si el path esta mal generado, en este caso
//si usara __dirname+"../public" daria como resultado server../public, con path resolve ahorramos ese error
app.use(express.static(path.resolve(__dirname, "../public")));

//configuracion global de rutas
app.use(require('./routes/index'));

//configuraciones por defecto de mongoose
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

//conexion a mongoose
mongoose.connect(process.env.URLDB, (err, res) => {

    if (err) throw err;

    console.log("Base de datos ONLINE");

})

//puerto de express
app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`);
})