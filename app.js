import Server from './config/server.js' ; 
import { config } from "dotenv";

config();

const server = new Server();

server.listen();

