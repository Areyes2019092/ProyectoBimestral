import  jwt  from "jsonwebtoken";

export const validarJWT = async(req, res, next) =>{
    const tok = req.header("x-token");
    if(!tok){
        return res.status(400).json({msg:"No existe el token"});
    }
    try {
              
    }catch(e){
    return   res.status(401).json({msg: "El token no es valido"});
    }
};