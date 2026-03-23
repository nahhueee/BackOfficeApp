import { App } from "./App";

export class AppCliente {
    id?:number;
    terminal?:string;
    mac?:string;
    app?:App;
    version?:string;
    actualizacion?:Date;
    habilitado?:boolean;

    constructor(data?: any) {
        if (data) {
          this.id = data.id;
          this.terminal = data.terminal;
          this.mac = data.mac;
          this.app = data.app;
          this.version = data.version;
          this.actualizacion = data.actualizacion;
          this.habilitado = data.habilitado;
        }
    }
}