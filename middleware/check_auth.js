const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.cookies.jwt;
try{
    const decoded = jwt.verify(token, process.env.SECRET);
    req.userData = decoded;
    next();
}catch(error){
    return res.status(401).json({
        message: "Auth failed"
    });
    
    }}



// delete cookies
// res.cookie("jwt", "", { maxAge: 1 });
