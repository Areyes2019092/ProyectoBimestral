import Categoria from '../categoria/categoria.model.js';
import Cliente from '../usuario/usuario.model.js';
import Producto from '../producto/producto.model.js';

//Si el cliente no existe tira error
export const noExisteClienteId = async(id = '' )=>{
    const cliente = await Cliente.findById(id);
    if(!cliente){
        throw new Error('El cliente no existe');
    }
};

export const existeProducto = async(producto = "")=>{
    const existencia = await Producto.findOne({name: producto});
    if(existencia){
        throw new Error('El producto ya existe')
    }
}

//Voy a verificar si no existe la categoria
export const noExisteCategoria = async(categoria = "")=>{
    const verificarCategoria = await Categoria.findOne({name: categoria });
    if(!verificarCategoria){
        throw new Error('La categoria no existe');
    }
};


//Si el cliente existe tira error
export const existeClienteUser = async(usuario = '')=>{
    const cliente = await Cliente.findOne({user: usuario});
    if(cliente){
        throw new Error('Este cliente ya existe');
    }
};


//Si el correo ya esta registrado marco error
export const existeClienteCorreo = async(correo = "")=>{
    const clienteCorreo = await Cliente.findOne({email: correo});
    if(clienteCorreo){
        throw new Error('El correo ya esta en uso')
    }
};

//Verificar el rol
export const existeRol = async (rol = "") => {
  if (rol !== "Administrador" && rol !== "Cliente") {
    throw new Error("El rol no es valido");
  }
};

//verificar categoria existe por el nombre
export const existeCategoria = async(categoria = "")=>{
    const verificarCategoria = await Categoria.findOne({name: categoria });
    if(verificarCategoria){
        throw new Error('La categoria ya existe');
    }
};