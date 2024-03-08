import mongoose from "mongoose";

const UsuarioSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "El nombre del cliente es obligatorio"],
  },
  user: {
    type: String,
    required: [true, "El usuario del cliente es obligatorio"],
  },
  email: {
    type: String,
    required: [true, "El email del cliente es obligatorio"],
  },
  //Me falta hacer el rol
  password: {
    type: String,
    required: [true, "La contrasña del cliente es obligatoria"],
  },
  rol: {
      type: String,
      enum: ["Cliente", "Administrador"],
      default: "Cliente"
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

UsuarioSchema.methods.toJSON = function () { 
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

export default mongoose.model("Usuario", UsuarioSchema);
