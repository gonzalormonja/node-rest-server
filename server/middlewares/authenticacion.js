const jwt = require('jsonwebtoken');
//===================
// VERIFICAR TOKEN
//===================
let verificaToken = (req, res, next) => {

    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({ //no autorizado
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        //lo agrego a la request para q las funciones q usan este middleware lo tengan disponible
        //es decir, en /usuario voy a tener ahora el usuario logeado
        req.usuario = decoded.usuario;

        //continuar con la ejecucion del programa
        next();
    });

}

//===================
// VERIFICAR AdminRole
//===================
let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === "ADMIN_ROLE") {
        next();
    } else {
        return res.status(401).json({ //no autorizado
            ok: false,
            err: {
                message: 'Usuario no autorizado'
            }
        });
    }
}



module.exports = {
    verificaToken,
    verificaAdminRole
}