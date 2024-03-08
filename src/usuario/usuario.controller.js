import bcryptjs from "bcryptjs";
import { generarJWT } from "../helpers/generar-jwt.js";
import Usuario from "./usuario.model.js";

//ALT + 96 Tilde invertida

export const login = async (req, res) => {
  const { user, password } = req.body;
  var cliente = await Usuario.findOne({ user: user });
  //Busco el cliente por medio del usuario y si no lo encuentra
  // busca por medio del email
  if (!cliente) {
    cliente = await Usuario.findOne({ email: user });
    if (!cliente) {
      //Si no lo encuentro ni por usuario o email es usuario no existe
      return res.status(400).json({ msg: "El usuario no existe" });
    }
  }
  const log = bcryptjs.compareSync(password, cliente.password);
  if (!log) {
    return res.status(400).json({ msg: "Credenciales erroneas" });
  }
  const tok = await generarJWT(cliente.id);
  res.status(200).json({ msg: `Bienvenido, aqui esta su token: ${tok}` });
};

export const editarNombre = async (req, res) => {
  const permitido = req.cliente;
  const nombre = req.body;
  await Usuario.findByIdAndUpdate(permitido.id, nombre);
  const nuevoCliente = await Usuario.findById(permitido.id);
  res
    .status(200)
    .json({ msg: `El usuario se actualizo correctamente ${nuevoCliente}` });
};

//El administrador puede eliminar perfiles
export const administradorDelete = async (req, res) => {
  const permitido = req.cliente;
  const { id } = req.params;
  const deshabilitado = await Usuario.findById(id);

  //Si cualquier usuario tiene un rol diferente a
  //administrador no tiene permisos
  if (permitido.rol !== "Administrador") {
    return res.status(400).json({ msg: "Error" });
  }
  if (!deshabilitado) {
    return res.status(404).json({ msg: `El usuario esta deshabilitado` });
  }
  await Usuario.findByIdAndUpdate(id, { estado: false });
  res.status(200).json({ msg: "El usuario se elimino" });
};

//Tengo que agregar nuevos datos
export const registrar = async (req, res) => {
  var cliente;
  var rol;
  const { name, user, email, password } = req.body;
  try {
    if (email.includes("@admin.gt")) {
      //si  cumple con @admin.gt se asignara el rol  Administrador
      rol = "Administrador";
      cliente = new Usuario({ name, user, email, password, rol });
    } else {
      //No incluire el rol, entonces sera default cliente
      cliente = new Usuario({ name, user, email, password });
    }
    const salt = bcryptjs.genSalt();
    //hasheo la contraseña del cliente antes de guardarla
    cliente.password = bcryptjs.hashSync(password, salt);

    await cliente.save();
    res
      .status(200)
      .json({ msg: `Usuario registrado correctamente ${cliente}` });
  } catch (error) {
    res
      .status(500)
      .json({ msg: `ERROR, El cliente no se pudo registrar s${error}` });
  }
};

export const eliminarUsuario = async (req, res) => { 
    const permitido = req.cliente;
    const { Password } = req.body;
    const verificar = await Usuario.findById(permitido.id);
    const login = bcryptjs.compareSync(Password, verificar.password);
    if (!login) { 
        return res.status(400).json({ msg: 'Datos Erroneos' });
    }
    await Usuario.findByIdAndUpdate(permitido.id, { estado: false });
    res.status(200).json({ msg: 'Usuario eliminado' });

}


export const administradorEditar = async (req, res) => {
    var { user, email,  password, ...resto } = req.body;
  const { id } = req.params;
  const permitido = req.cliente;
  const deshabilitado = await Usuario.findById(id);
  if (permitido.rol !== "Administrador") {
    return res.status(400).json({ msg: "Error" });
  }
  if (!deshabilitado) {
    return res.status(400).json({ msg: "El usuario esta deshabilitado" });
    }
    await Usuario.findByIdAndUpdate(id, { resto });
    res.status(200).json({ msg: 'Usuario Actualizado' });
};

export const editarContrasena = async (req, res) => {
  const permitido = req.cliente;
  const { contrasenaAnterior, contrasenaNueva } = req.body;
  const permitidoPorId = await Usuario.findById({ _id: permitido.id });
  const log = bcryptjs.compareSync(contrasenaAnterior, permitidoPorId.password);
  if (!log) {
    return res.status(400).json({ msg: "Contraseña o Usuario incorrecto" });
  }
  const salt = bcryptjs.genSaltSync();
  const contrasena = bcryptjs.hashSync(contrasenaNueva, salt);
  await Usuario.findByIdAndUpdate(permitido.id, { password: contrasena });
  res.status(200).json({ msg: "Contraseña editada exitosamente" });
};
