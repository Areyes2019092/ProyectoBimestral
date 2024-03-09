import Carrito from "./carrito.model.js";

//Verificacion para que el usuario solo pueda tener un carrito
export const hacerCarrito = async(req, res)=>{
    const permitido = req.cliente;
    const carritoYaCreado = await Carrito.findOne({nombreCarrito: permitido._id })
    if(carritoYaCreado){
        return res.status(400).json({msg: 'Carro de compras ya en uso'});
    }
    const nuevoCarrito = new Carrito({nombreCarrito: permitido._id, productos: [], cantidadTotal: 0})
    await nuevoCarrito.save();
    res.status(200).json({msg: 'Acaba de crear un carro de compras'})
}