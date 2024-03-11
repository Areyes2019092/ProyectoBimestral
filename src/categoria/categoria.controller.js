import usuarioModel from "../usuario/usuario.model.js";
import Categoria from "./categoria.model.js";
import { response, request } from "express";

export const publicarCategoria = async (req, res) => { 
    const permitido = req.cliente;
    const { name } = req.body;
    if (permitido.role !== "Administrador") { 
        return res.status(400).json({ msg: "El usuario no puede realizar esta acción" });
    }
    try {
        const nuevaCategoria = new Categoria({name});
        await nuevaCategoria.save();
        res.status(200).json({msg: `La categoría : ${nuevaCategoria} se ha registrado exitosamente`});
    } catch (e) {
        res.status(500).json({ msg: `Error ${e}` });
     }
}


export const obtenerCategoria = async (req, res) => {
    const permitido = req.cliente;
    if (permitido.role !== "Administrador") {
        return res.status(400).json({ msg: "El usuario no puede realizar esta acción" });
    }
    const monstrarCategorias = await Categoria.find({ estado: true });
    res.status(200).json({ monstrarCategorias });
};


export const eliminarCategoria = async (req, res) => {
    const permitido = req.cliente;
    const { id } = req.params;
    if (permitido.role !== "Administrador") {
        return res.status(400).json({ msg: "El usuario no puede realizar esta acción" });
    }
    await Categoria.findByIdAndUpdate(id, { estado: false });
    res.status(200).json({ msg: 'Categoría eliminada exitosamente' });
};


export const actualizarCategoria = async (req, res) => {
    const permitido = req.cliente;
    const { id } = req.params;
    if (permitido.role !== "Administrador") {
        return res.status(400).json({ msg: 'El usuario no puede realizar esta acción' });
    }
    const { name } = req.body;
    await Categoria.findByIdAndUpdate(id, { name: name });
    res.status(200).json({ msg: 'Se actualizó la categoría' });
};
