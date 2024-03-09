import mongoose, { Schema } from "mongoose";

const CarritoSchema = new mongoose.Schema({
    nombreCarrito:{
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: [true, "Este campo es obligatorio"]
    },
    productos: [{
        producto:{
            type: Schema.Types.ObjectId,
            ref: "Productos"
        },
        cantidadProducto:{
            type: Number,
            default: 1,
            min: 1.
        },
    }],
    cantidadTotal:{
        type: Number,
    },
    estado:{
        type: Boolean,
        default: true,
    }
});

CarritoSchema.methods.toJSON = function(){
    const { __v, _id, ...resto } = this.toObject();
    resto.uid = _id;
    return resto;
};

export default mongoose.model("Carrito", CarritoSchema);