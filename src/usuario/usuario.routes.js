import { Router } from "express";
import { check } from "express-validator";
import {
  existeClienteCorreo,
  existeClienteUser,
  existeRol,
} from "../helpers/validar-db.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarInformacion } from "../middlewares/validarCampos.js";
import {
  administradorDelete,
  administradorEditar,
  editarContrasena,
  editarNombre,
  eliminarUsuario,
  login,
  registrar,
} from "./usuario.controller.js";
const router = Router();

router.get("/", [validarInformacion], login);

router.delete(
  "/administrador/:id",
  [
    validarJWT,
    check("id", "El id es obligatorio").isMongoId(),
    validarInformacion,
  ],
  administradorDelete
);

router.delete(
  "/",
  [
    validarJWT,
    check("Password", "La contrasena es obligatoria").isLength({ min: 5 }),
    validarInformacion,
  ],
  eliminarUsuario
);

router.put(
  "/",
  [
    validarJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    validarInformacion,
  ],
  editarNombre
);

router.post(
  "/",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("user", "El usuario es obligatorio").not().isEmpty(),
    check("user").custom(existeClienteUser),
    check("email", "El email es obligatorio").isEmail(),
    check("email").custom(existeClienteCorreo),
    check("password", "La contrasena es muy corta").isLength({ min: 5 }),
    validarInformacion,
  ],
  registrar
);

router.put(
  "/contrasena/",
  [
    validarJWT,
    check("contrasenaAnterior", "La contrasena es muy corta").isLength({
      min: 5,
    }),
    check("contrasenaNueva", "La contrasena es muy corta").isLength({
      min: 5,
    }),
    validarInformacion,
  ],
  editarContrasena
);

router.put(
  "/administrador/:id",
  [
    validarJWT,
    check("id", "El id es obligatorio").isMongoId(),
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("rol", "El rol es obligatorio").not().isEmpty(),
    check("rol").custom(existeRol),
    validarInformacion,
  ],
  administradorEditar
);

export default router;
