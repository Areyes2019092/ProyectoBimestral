import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { hacerCarrito } from "./carrito.controller.js";
import { validarInformacion } from "../middlewares/validarCampos.js";
import { check } from "express-validator";

const router = Router();

router.post(
    "/",
    [
        validarJWT,
        validarInformacion
    ],hacerCarrito
);

export default router;
