import mongoose from "mongoose";

const CategoriaSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "La categoria es obligatoria"]
    },
    estado: {
        type: Boolean,
        default: true
    },
});

CategoriaSchema.methods.toJSON = function () {
    const { __v, _id, ...category } = this.toObject();
    category.id = _id;
    return category;
 }

export default mongoose.model("Categoria", CategoriaSchema);