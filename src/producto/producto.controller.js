import Producto from "./producto.model.js";
import Categoria from "../categoria/categoria.model.js";

export const editarProducto = async (req, res) => {
    const { id } = req.params;
    const { producto, precio, categoria, existencia } = req.body;
    const permitido = req.cliente;
    if (permitido.rol !== "Administrador") { 
        return res.status(400).json({ msg: 'No tiene permisos' });
    }
  
    try {
        const actualizarProducto = await Producto.findByIdAndUpdate(id, { name: producto, precio, categoria, existencia }, { new: true });
        if (!actualizarProducto) {
            return res.status(404).json({ msg: 'El producto no se encontró' });
        }
        res.status(200).json({ msg: 'El producto se actualizó correctamente' });
    } catch (e) {
        console.error("Error al actualizar el producto:", e);
        res.status(500).json({ msg: "Error" });
    }
}


//mostrar el producto por medio de la existencia
export const unicoProducto = async(req, res)=>{
    const { name } = req.body;
    if(name){
        const encontrarPorExistencia = await Producto.findOne({name: name}).lean();
        if(encontrarPorExistencia){
           //Hago una pequeña validacion por si el producto ya no existe
            if(encontrarPorExistencia.existencia === 0){
                encontrarPorExistencia.status = 'Ya no se encuentra en existencia';
            }
            return res.status(200).json(encontrarPorExistencia);
        }
        res.status(404).json({msg: 'El producto que usted busca ya no se encuentra'})
    }
};
export const todosProducto = async (req, res) => {
    const { ordenar } = req.params; 
    let pipeline = [];
    try {
        if (ordenar === 'categoria') {
            pipeline.push(
                { $match: { estado: true } },
                { $group: { _id: '$categoria', products: { $push: '$$ROOT' } } }
            );
        } else if (ordenar === 'ventas') {
            pipeline.push(
                { $match: { estado: true } },
                { $sort: { ventas: -1 } }
            );
        } else {
            return res.status(400).json({ msg: 'Datos incorrectos' });
        }

        const productos = await Producto.aggregate(pipeline);
        
        if (!productos || productos.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron productos' });
        }

        await Promise.all(productos.map(async (grupo) => {
            const categoria = await Categoria.findById(grupo._id);
            const nombre = categoria ? categoria.name : 'Desconocido';
            // Verifica si grupo.products está definido antes de iterar sobre él
            if (grupo.products) {
                grupo.products.forEach(producto => {
                    producto.categoria = nombre;
                    if (producto.existencia === 0) {
                        producto.status = 'Ya no está disponible';
                    }
                });
            }
        }));

        res.status(200).json({ productos });
    } catch (e) {
        console.error(`Error: ${e}`);
        res.status(500).json({ msg: 'Error interno del servidor' });
    }
};





export const eliminarProducto = async(req, res) =>{
    const permitido = req.cliente;
    const { id } = req.params;
    if(permitido.rol !== "Administrador"){
        return res.status(400).json({msg:'El usuario no tiene los permisos'});
    }
    await Producto.findByIdAndUpdate(id, {estado: false});
    res.status(200).json({msg: 'El prdducto se elimino correctamente'});
}

export const publicarProducto = async(req, res)=>{
    const permitido = req.cliente;
    const { producto, precio, categoria, existencia } = req.body;
    if(permitido.rol !== "Administrador"){
        return res.status(400).json({msg: 'El usuario no puede hacer estas acciones'});
    }
    const verificarCat = await Categoria.findOne({name:categoria});
    const verificarCategoriaId = verificarCat._id;
    try{
        const nuevoProducto = new Producto({name: producto, precio, categoria: verificarCategoriaId, existencia})
        await nuevoProducto.save();
        res.status(200).json({msg: `Se agrego el producto: ${nuevoProducto}`});
    }catch(e){
        res.status(500).json({e});
    }
}