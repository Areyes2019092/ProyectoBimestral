import mongoose, { Schema } from "mongoose";

const FacturaSchema = new mongoose.Schema({
    carrito: {
        type: Schema.Types.ObjectId,
        ref: "Carrito",
        required: true
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    compraTotal: {
        type: Number,
        required: true
    },
    fechaEmision: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model("Factura", FacturaSchema);