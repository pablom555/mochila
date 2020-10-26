const jwt = require('jsonwebtoken');

const verifyToken = ( req, res, next ) => {

    if (!req.headers.token) {
        return res.status(403).json({ok: false, err: { message: 'La peticion no tiene la cabecera de autenticación' }});
    } 
        
    const token = req.headers.token.replace(/['"]+/g, '');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        
        if ( err ) {
            return res.status(401).json({
                ok:false,
                err: {
                    message: "Token must be provided"
                }
            });
        }

        req.user = decoded.user;

        next();

    })
    
}

const verifyAdminRole = (req, res, next ) => {

    const { role } = req.user;

    if ( role !== 'ADMIN_ROLE' ) {

        return res.status(401).json({
            ok: false,
            err: {
                message: "User dont have permission for this action"
            }
        });
    }

    next();
}

module.exports = {
    verifyToken,
    verifyAdminRole
}