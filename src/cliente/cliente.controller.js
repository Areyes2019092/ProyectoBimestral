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
    const {  contrasenaAnterior, contrasenaNueva  } = req.body;
    const permitido = req.cliente;
    const permitidoPorId = await Cliente.findOne({_id: permitido.id})
    const log = bcryptjs.compareSync(contrasenaAnterior, permitidoPorId.password);
    if(!log){
        return res.status(400).json({msg:"Contraseña o Usuario incorrecto"});
    }
    const salt = bcryptjs.genSaltSync();
    const contrasena = bcryptjs.hashSync(contrasenaNueva, salt);
    await Cliente.findByIdAndUpdate(permitido.id, { password: contrasena });
    res.status(200).json({msg: "Contraseña editada exitosamente"});
}