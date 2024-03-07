import bcryptjs, { compare } from "bcryptjs";
import { generarJWT } from "../helpers/generar-jwt";
import Cliente from './cliente.model.js'

//ALT + 96 Tilde invertida

export const login = async(req, res)=>{
    var tok;
    const { user, password } = req.body;
    var cliente = await Cliente.findOne({user: user});
    //Busco el cliente por medio del usuario y si no lo encuentra
    // busca por medio del email
    if(!cliente){
        cliente = await Cliente.findOne({email: user});
        if(!cliente){
            //Si no lo encuentro ni por usuario o email es usuario no existe
            return res.status(400).json({msg:'El usuario no existe'});
    }
}
    const log = bcryptjs.compareSync(password, cliente.password);
    tok = await generarJWT(cliente.id);
    res.status(200).json({msg: `Bienvenido, aqui esta su token: ${tok}`});
};


//Tengo que agregar nuevos datos
export const registrar = async(req, res)=>{
    const { name, user, email, password } = req.body;
    try{
        const salt = bcryptjs.genSaltSync();
        const cliente = new Cliente({name, user, email, password});
        
        //hasheo la contraseña del cliente antes de guardarla
        cliente.password = bcryptjs.hashSync( password, salt);

        await cliente.save();
        res.status(200).json({msg: `Cliente registrado correctamente ${cliente}`});

    }catch(error){
        res.status(400).json({msg:`ERROR, El cliente no se pudo registrar s${error}`});
    }
};



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