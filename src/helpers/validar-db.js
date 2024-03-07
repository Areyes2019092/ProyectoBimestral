import Cliente from '../cliente/cliente.model.js';


//Si el cliente no existe tira error
export const noExisteClienteId = async(id = '' )=>{
    const cliente = await Cliente.findById(id);
    if(!cliente){
        throw new Error('El cliente no existe');
    }
};

//Si el cliente existe tira error
export const existeClienteUser = async(usuario = '')=>{
    const cliente = await Cliente.findOne({user: usuario});
    if(cliente){
        throw new Error('Este cliente ya existe');
    }
}


//Si el correo ya esta registrado marco error
export const existeClienteCorreo = async(correo = "")=>{
    const clienteCorreo = await Cliente.findOne({email: correo});
    if(clienteCorreo){
        throw new Error('El correo ya esta en uso')
    }
}