import mongoose from "mongoose";

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
    password:{
        type: String,
        required: [true]
    }
    
});