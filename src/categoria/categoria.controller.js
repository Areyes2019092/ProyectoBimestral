import Categoria from "./categoria.model.js";
import { response, request } from "express";


/*Para que las verificaciones sean mas faciles
en cada una si el role es diferente al de administrador
ya no va a poder realizar las acciones*/
export const publicarCategoria = async (req, res) => { 
    const permitido = req.cliente;
    const { name } = req.body;
    if (permitido.role !== "Administrador") { 
        return res.status(400).json({ msg: "El usuario no puede realizar esta accion" });
    }
    try {
        const nuevaCategoria = new Categoria({name});
        await nuevaCategoria.save();
        res.status(200).json({msg: `La categoria : ${nuevaCategoria} se ha registrado exitosamente`});
    } catch (e) {
        res.status(500).json({ msg: `Error ${e}` });
     }
}


export const obtenerCategoria = async (req, res) => {
    const permitido = req.cliente;
    if (permitido.role !== "Administrador") {
        return res.status(400).json({ msg: "El usuario no puede realizar esta accion" });
    }
    const monstrarCategorias = await Categoria.find({ estado: true });
    res.status(200).json({ monstrarCategorias });
};


export const eliminarCategoria = async (req, res) => {
    const permitido = req.cliente;
    const { id } = req.params;
    if (permitido.role !== "Administrador") {
        return res.status(400).json({ msg: "El usuario no puede realizar esta accion" });
    }
    await Categoria.findByIdAndUpdate(id, { estado: false });
    res.status(200).json({ msg: 'Categoria eliminada exitosamente' });
};


export const actualizarCategoria = async (req, res) => {
    const permitido = req.cliente;
    const { id } = req.params;
    if (permitido.role !== "Administrador") {
        return res.status(400).json({ msg: 'El usuario no puede realizar esta accion' });
    }
    const { name } = req.body;
    await Categoria.findByIdAndUpdate(id, { name: name });
    res.status(200).json({ msg: 'Se actualizo la categoria' });
};
