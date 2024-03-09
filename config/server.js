'use strict';

import morgan from "morgan";
import  express  from "express";
import helmet from "helmet";
import cors from "cors";
import Producto from "../src/producto/producto.routes.js";
import Usuario from "../src/usuario/usuario.routes.js";
import Categoria from "../src/categoria/categoria.routes.js";
import Carrito from "../src/carrito/carrito.routes.js";
import { dbConnection } from "./mongo.js";
class Server {
    constructor() {
      this.app = express();
      this.port = process.env.PORT;
      this.usuarioPath = "/tiendaOnline/v1/usuarios";
      this.categoriaPath = "/tiendaOnline/v1/categorias";
      this.productoPath = "/tiendaOnline/v1/productos";
      this.carritoPath = "/tiendaOnline/v1/carrito";  
      this.middlewares();
      this.conectarDB();
      this.routes();
    }
  
    async conectarDB() {
      await dbConnection();
    }
  
    middlewares() {
      this.app.use(
        express.urlencoded({
          extended: false,
        })
      );
      this.app.use(cors());
      this.app.use(express.json());
      this.app.use(helmet());
      this.app.use(morgan("dev"));
    }
  
    routes() {
      this.app.use(this.usuarioPath, Usuario);
      this.app.use(this.categoriaPath, Categoria);
      this.app.use(this.productoPath, Producto);
      this.app.use(this.carritoPath, Carrito);
    }
  
    listen() {
      this.app.listen(this.port, () => {
        console.log("Servidor ejecutandose en puerto", this.port);
      });
    }
  }

  
export default Server;