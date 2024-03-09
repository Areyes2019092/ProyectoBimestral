import Producto from "../producto/producto.model.js";
import Carrito from "./carrito.model.js";
import Usuario from "../usuario/usuario.model.js";
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
};


//Obtener el hisotial (factura)

export const obtenerFactura = async(req, res)=>{
    const permitido = req.cliente;
    const compraRegistro = await Factura.find({cliente: permitido._id}).populate('carrito');
    if(!compraRegistro){
        return res.status(404).json({msg: 'No puedes generar factura sin haber ordenado antes'})
    }
    res.status(200).json({compraRegistro});
};


//Obtener el hisotial del admin
export const obtenerAdminHistorial = async(req, res)=>{
    const permitido = req.cliente;
    const { id } = req.params;
    if (permitido.rol !== "Administrador"){
        return res.status(400).json({msg: 'Permisos erroneo'});
    }
    const existe = await Usuario.findById(id);
    if(!existe){
        return res.status(404).json({msg: 'El usuario no existe'});
    }
    // si no existen compras
    //revisar populate carro al final de la linea
    const historialDeCompras = await Factura.find({ cliente: id }).populate('carrito'); 
    if(!historialDeCompras || historialDeCompras.length === 0 ){
        return res.status(404).json({msg:'No se han hecho compras'});
    }
    res.status(200).json({historialDeCompras});
};


//Hacer una orden
/* 
Cuando haces populate('productos.productos'), estás diciendo a 
Mongoose que quieres llenar el campo productoss.productos del
documento que recuperas de la base de datos. Esto significa que en 
la colección CartShoppingModel, el campo products es una referencia
a otra colección, y cada elemento de products tiene un campo llamado
product que es una referencia a documentos en esa otra colección.
*/
//Hay que ver donde dice productos
/*
export const hacerCompra = async (req, res) => {
    const usuarioAutenticado = req.cliente;
    const cart = await Carrito.findOne({ nombreCarrito: usuarioAutenticado._id }).populate('productos.producto');

    if (!cart || cart.productos.length === 0) {
        return res.status(404).json({ msg: "Shopping cart is empty" });
    }

    let total;
    const productsDetails = []; 

    cart.productos.forEach(item => {
        const productTotal = item.producto.precio * item.ventas;
        total += productTotal;

        productsDetails.push({
            name: item.producto.name,
            cantidadProducto: item.cantidadProducto,
            cantidadTotal: productTotal
        });
    });

    const factura = new Factura({
        carrito: cart._id,
        cliente: usuarioAutenticado._id,
        compraTotal : total,
        productos: productsDetails 
    });

    for (const item of cart.productos) {
        const productId = item.producto._id;
        const quantitySold = item.cantidadTotal;

        await Producto.findByIdAndUpdate(productId, { $inc: { ventas: quantitySold, existencia: -quantitySold } });
    }

    cart.productos = [];
    cart.cantidadTotal = 0; 
    await cart.save();

    await factura.save();

    res.status(200).json({ msg: "Purchase completed successfully", factura, productsDetails });
};

*/

export const hacerCompra = async (req, res) => {
    const usuarioAutenticado = req.cliente;
    const cart = await Carrito.findOne({ nombreCarrito: usuarioAutenticado._id }).populate('productos.producto');

    if (!cart || cart.productos.length === 0) {
        return res.status(404).json({ msg: "El carrito esta vacio" });
    }

    let compraTotal = 0;
    const detalles = []; 

    cart.productos.forEach(item => {
        const productoTotal = item.producto.precio * item.cantidadProducto;
        compraTotal += productoTotal;

        detalles.push({
            name: item.producto.name,
            cantidadProducto: item.cantidadProducto,
            compraTotal: productoTotal
        });
    });

    const factura = new Factura({
        carrito: cart._id,
        cliente: usuarioAutenticado._id,
        compraTotal,
        productos: detalles 
    });

    for (const item of cart.productos) {
        const productoId = item.producto._id;
        const vendido = item.cantidadProducto;
        await Producto.findByIdAndUpdate(productoId, { $inc: {ventas : vendido, existencia: -vendido } });
    }
// limpiar
    cart.productos = [];
    cart.compraTotal = 0; 
    await cart.save();

    await factura.save();

    res.status(200).json({ msg: "Compra completada", factura, detalles });
};




export const agregrarProducto = async(req, res)=>{
    const permitido = req.cliente;
    const { producto, cantidadProducto } = req.body;
    const productoVariable = await Producto.findOne({ name: producto});
    const carroVa = await Carrito.findOne({ nombreCarrito: permitido._id});
    if(!carroVa){
        return res.status(404).json({ msg: 'El carrito no existe' });
    }if(!carroVa.nombreCarrito.equals(permitido._id)){
        return res.status(400).json({ msg: 'No se puede crear el carrito' });
    }
    const productoAEspera = carroVa.productos.find(item => item.producto.equals(productoVariable._id));
    const cantidadAEspera = ( productoAEspera ? productoAEspera.cantidadProducto : 0 ) + cantidadProducto;
    if(cantidadAEspera > productoVariable.existencia){
        return res.status(400).json({ msg: 'No se puede agregar tantos productos' });
    }
    if(productoAEspera){
        productoAEspera.cantidadProducto += cantidadProducto;
    }else{
        carroVa.productos.push({ producto: productoVariable._id, cantidadProducto });
    }
    carroVa.cantidadTotal += productoVariable.precio * cantidadProducto;
    await carroVa.save();
    return res.status(200).json({ msg: 'Producto agregado' });

};