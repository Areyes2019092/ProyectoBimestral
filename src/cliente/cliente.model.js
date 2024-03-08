/*
import mongoose from "mongoose";

//Tengo que agregar mas campos

const ClienteSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, "El nombre del cliente es obligatorio"]
    },
    user:{
        type: String,
        required: [true,"El usuario del cliente es obligatorio"]
    },
    email:{
        type: String,
        required: [true, "El email del cliente es obligatorio"]
    },
    //Me falta hacer el rol
    password:{
        type: String,
        required: [true, "La contrasña del cliente es obligatoria"]
    },
    estado:{
        type: Boolean,
        default: true
    }
});

ClienteSchema.methods.toJSON = function(){
    const { __v, password, _id, ...clientess } = this.toObject();
    clientess.uid = _id;
    return clientess
}

export default mongoose.model("Cliente", ClienteSchema);
*/