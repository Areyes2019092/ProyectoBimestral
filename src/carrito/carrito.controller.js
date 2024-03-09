import Producto from "../producto/producto.model.js";
import Carrito from "./carrito.model.js";
import Factura from "../factura/factura.model.js";

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


//Obtener el hisotial (factura)

export const obtenerFactura = async(req, res)=>{
    const permitido = req.cliente;
    const compraRegistro = await Factura.find({cliente: permitido._id}).populate('carrito');
    if(!compraRegistro){
        return res.status(404).json({msg: 'No puedes generar factura sin haber ordenado antes'})
    }
    res.status(200).json({compraRegistro});
}


//Hacer una orden
/** 
export const hacerCompra = async (req, res) => {
    const permitido = req.cliente;
    const cart = await Carrito.findOne({ nombreCarrito: permitido._id }).populate('productos.producto');

    if (!cart || cart.productos.length === 0) {
        return res.status(404).json({ msg: "El carrito de compras está vacío" });
    }

    let total = 0;
    const productsDetails = []; 

    cart.productos.forEach(item => {
        const productTotal = item.producto.precio * item.cantidadProducto;
        total += productTotal;

        productsDetails.push({
            nombre: item.producto.nombre,
            cantidad: item.cantidadProducto,
            total: productTotal
        });
    });

    const factura = new Factura({
        carrito: cart._id,
        cliente: permitido._id,
        total,
        productos: productsDetails 
    });

    for (const item of cart.productos) {
        const productId = item.producto._id;
        const quantitySold = item.cantidadProducto;

        await Producto.findByIdAndUpdate(productId, { $inc: { cantidadVentas: quantitySold, stock: -quantitySold } });
    }

    // Limpiar carrito
    cart.productos = [];
    cart.cantidadTotal = 0; 
    await cart.save();

    await factura.save();

    res.status(200).json({ msg: "Compra realizada con éxito", factura, productsDetails });
};
**/
export const agregrarProducto = async(req, res)=>{
    const permitido = req.cliente;
    const { producto, cantidadProducto } = req.body;
    const product = await Producto.findOne({name: producto});
    const carritoCompras = await Carrito.findOneAndUpdate(
        {nombreCarrito: permitido._id},
        {$inc:{ total: product.precio * cantidadProducto}, $addToSet: {productos: {product: product._id. cantidadProducto }}},        
        { upsert: true, new: true }
        );
        if (!carritoCompras) {
            return res.status(404).json({ msg: "No se encontro" });
        }
        if(!carritoCompras.nombreCarrito.equals(permitido._id)){
            return res.status(404).json({ msg: "No permitido" });
        }
        res.status(200).json({ msg: "Producto agregado exitosamente" });
}