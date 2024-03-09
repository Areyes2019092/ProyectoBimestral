import  JWT  from "jsonwebtoken";
import Cliente from "../usuario/usuario.model.js";

export const validarJWT = async(req, res, next) =>{
    const tok = req.header("x-token");
    if(!tok){
        return res.status(400).json({msg:"No existe el token"});
    }
    try {
        const { uid } = JWT.verify.apply(tok, process.env.SECRETORPRIVATEKEY);
        const cliente = await Cliente.findOne({_id: uid});

        if(!cliente){
            res.status(400).json({msg:'El cliente no existe'});
        }
        if (cliente.estado == false) { 
            return res.status(400).json({msg: 'El cliente no existe'})
        }

        req.cliente = cliente;
        next();
    }catch(e){
    return res.status(401).json({msg: "El token no es valido"});
    }
};