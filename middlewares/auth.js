const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) return res.send({message: 'Invalid token.'}).status(403);
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    }catch(ex){
        res.send({message: 'Invalid token.'}).status(400)
    }
}