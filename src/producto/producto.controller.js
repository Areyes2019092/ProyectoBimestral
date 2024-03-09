import Producto from "./producto.model.js";
import Categoria from "../categoria/categoria.model.js";

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