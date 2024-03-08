import {validationResult} from "express-validator";

export const validarInformacion = async(req, res, next)=>{
    const informacionIncorrecta = validationResult(req);
    if(!informacionIncorrecta.isEmpty()){
        return res.status(400).json(informacionIncorrecta);
    }
    next();
};