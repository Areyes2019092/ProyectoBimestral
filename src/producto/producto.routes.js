import { check } from "express-validator";
import { Router } from "express";
import { validarInformacion } from "../middlewares/validarCampos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { publicarProducto } from "./producto.controller.js";
import { noExisteCategoria, existeProducto } from "../helpers/validar-db.js";
const router = Router();

router.post(
    "/",
    [
        validarJWT,
        check("producto", "El producto es obligatorio").not().isEmpty(),
        check("producto").custom(existeProducto),
        check("precio","El precio es obligatorio").isNumeric(),
        check("categoria","La categoria es obligatoria").not().isEmpty(),
        check("categoria").custom(noExisteCategoria),
        check("existencia","La categoria es obligatoria").not().isEmpty(),
        validarInformacion
    ],publicarProducto
);

export default router;