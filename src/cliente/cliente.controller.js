import bcryptjs from "bcryptjs";
import { generarJWT } from "../helpers/generar-jwt";
import Cliente from './cliente.model.js'

export const editarNombre = async(req, res) =>{
    const permitido = req.cliente;
    const nombre = req.body;
    const nuevoCliente = await Cliente.find({_id: permitido.id});
    await Cliente.findByIdAndUpdate(permitido.id, nombre);
    res.status(200).json({msg: "Su nombre se actualizado de forma correcta", nuevoCliente});
};

export const editarContrasena = async(req, res)=>{
    
}