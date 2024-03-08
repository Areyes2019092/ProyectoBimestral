import { check } from "express-validator";
import { Router } from "express";
import { validarInformacion } from "../middlewares/validarCampos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { existeCategoria } from "../helpers/validar-db.js";
import { eliminarCategoria, obtenerCategoria, actualizarCategoria, publicarCategoria } from "./categoria.controller.js";
const router = Router();

router.get(
    "/",
    [
        validarJWT,
        validarInformacion
    ],obtenerCategoria
);

router.put(
    "/:id",
    [
        validarJWT,
        check("id","El id es obligatorio").isMongoId(),
        check("name","El nombre es obligatorio").not().isEmpty(),
        check("name").custom(existeCategoria),
        validarInformacion,
    ],actualizarCategoria
);

router.post(
    "/",
    [
        validarJWT,
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check("name").custom(existeCategoria),
        validarInformacion,
    ],publicarCategoria
);

router.delete(
    "/:id",
    [
        validarJWT,
        check("id","El id es obligatorio").isMongoId(),
        validarInformacion
    ],eliminarCategoria
);

export default router;