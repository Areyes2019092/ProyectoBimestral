import mongoose, { Schema } from "mongoose";
//Importe Schema en vez de solo mongoose porque voy a usar el schema en categoria

const ProductoSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "El nombre del producto es obligatorio"]
    },
    precio:{
        type: Number,
        required: [true, "El precio del producto es obligatorio"]
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: "Categoria",
    },
    existencia:{
        type: Number,
        required: [true, "La existencia del producto es obligatorio"],
        default: 0
    },
    ventas:{
        type: Number,
        default: 0,
    },
    estado:{
        type: Boolean,
        default: true
    }
});

ProductoSchema.methods.toJSON = function(){
    const { __v, _id, ...resto } = this.toObject();
    resto.uid = _id;
    return resto;
};

export default mongoose.model("Producto", ProductoSchema);