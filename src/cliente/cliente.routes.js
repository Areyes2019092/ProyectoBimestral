/*
import { check } from "express-validator";
import { login, registrar, editarNombre, editarContrasena } from "./cliente.controller.js";
import { validarInformacion } from "../middlewares/validarCampos.js";
import { existeClienteCorreo, existeClienteUser } from "../helpers/validar-db.js";
import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
const router = Router();

router.put(
    "/password/",
    [
        validarJWT,
        check("contrasenaAnterior", "La contraseña es muy corta").isLength({min:7}),
        check("contrasenaNueva","La contraseña es muy corta").isLength({min:6}),
        validarInformacion,
    ],editarContrasena
);

router.put(
    "/",
    [
        check("name","El nombre es obligatorio").not().isEmpty(),
        validarInformacion,
    ],editarNombre
)

export default router;
*/
