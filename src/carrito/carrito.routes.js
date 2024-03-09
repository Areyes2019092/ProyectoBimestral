import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarInformacion } from "../middlewares/validarCampos.js";
import { check } from "express-validator";
import { noExisteProducto } from "../helpers/validar-db.js";
import { hacerCompra , obtenerFactura ,hacerCarrito, agregrarProducto } from "./carrito.controller.js";

const router = Router();

router.post(
    "/comprar/",
    [
        validarJWT,
        validarInformacion
    ],hacerCompra
);


router.put(
    "/",
    [
        validarJWT,
        check("producto", "El producto es obligatorio").not().isEmpty(),
        check("producto").custom(noExisteProducto),
        check("cantidadProducto","La cantidad es obligatoria").not().isEmpty(),
        validarInformacion
    ],agregrarProducto
)

router.get(
    "/",
    [
        validarJWT,
        validarInformacion
    ],obtenerFactura
)

router.post(
    "/",
    [
        validarJWT,
        validarInformacion
    ],hacerCarrito
);

export default router;
