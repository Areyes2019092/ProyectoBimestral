"use strict";

import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    mongoose.connection.on("open", () => {
      console.log("MongoDB | conectado a la base de datos");
    });
    await mongoose.connect(process.env.URI_MONGO, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 50,
    });
  } catch (error) {
    console.log("Error al conectar la base de datos", error);
  }
};
