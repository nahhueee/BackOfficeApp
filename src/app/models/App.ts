import { AppCliente } from "./AppsCliente";

export class App{
    id: number;
    nombre: string;
    version: string;
    link: string;
    info: string;
    estado: string;
    apps: AppCliente[];

    constructor(data:any){
        this.id = data.id;
        this.nombre = data.nombre;
        this.version = data.version;
        this.link = data.link;
        this.info = data.info;
        this.estado = data.estado;
        this.apps = data.apps;    
    }
}