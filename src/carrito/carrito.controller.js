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
export const hacerCompra = async(req, res) =>{
    const permitido = req.cliente;
    const carrito = await Carrito.findOne({nombreCarrito: permitido._id}).populate('productos.producto');
    if(!carrito || carrito.productos.length === 0){
        return res.status(400).json({ msg: "El carrito no puede estar vacio" });
    }
    let total = 0;
    const informacion = carrito.productos.map(item =>{
        const totalAPagar = item.producto.precio * item.cantidadProducto;
        total += totalAPagar;
        return{
            nombreCarrito: item.producto.nombreCarrito,
            cantidadProducto: item.cantidadProducto,
            cantidadTotal: totalAPagar
        };
    });
    const factura = new Factura({
        carrito: carrito._id, 
        cliente: permitido._id,
        total,
        productos: informacion
    });

    for(const { producto, cantidadProducto }of carrito.productos){
        await Producto.findByIdAndUpdate(producto._id, { $inc:{ cantidadVentas: cantidadProducto, existencia: -cantidadProducto }});
    } 
    carrito.productos = [];
    carrito.total = 0;
    await carrito.save();
    await factura.save();
    res.status(200).json({msg:'Orden completada'});
};

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