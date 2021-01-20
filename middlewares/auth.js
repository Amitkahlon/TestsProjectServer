const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
<<<<<<< Updated upstream
    if(!token) return res.status(401).send({message: 'Invalid token.'});
=======
    if(!token) return res.send({message: 'Invalid token.'}).status(403);
>>>>>>> Stashed changes
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    }catch(ex){
        res.send({message: 'Invalid token.'}).status(400)
    }
}