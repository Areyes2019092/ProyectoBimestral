import { check } from "express-validator";
import { Router } from "express";
import { validarInformacion } from "../middlewares/validarCampos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { publicarProducto, editarProducto, eliminarProducto, unicoProducto, todosProducto } from "./producto.controller.js";
import { productoId ,noExisteCategoria, existeProducto  } from "../helpers/validar-db.js";
const router = Router();

router.get(
    "/",
    [
        validarJWT,
        validarInformacion,
    ],todosProducto
);


router.get(
    "/buscarProducto/",
    [
        validarJWT,
        check("name","El nombre es obligatorio").not().isEmpty(),
        validarInformacion,
    ], unicoProducto
);

router.get(
    "/productoOrdenar/:ordenar",
    [
        validarJWT,
        validarInformacion,
    ], todosProducto
);

router.delete(
    "/:id",
    [
        validarJWT,
        check("id","El id es obligatorio").isMongoId(),
        check("id").custom(productoId),
        validarInformacion,
    ],eliminarProducto
);

router.put(
    "/:id",
    [
        validarJWT,
        check("id","El id es obligatorio").isMongoId(),
        //hacer mas validaciones
        check("id").custom(productoId),
        validarInformacion,
    ],editarProducto
);

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