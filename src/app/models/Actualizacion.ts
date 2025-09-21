export class Actualizacion {
    id?:number;
    resumen?:string;
    mejoras?:string;
    correcciones?:string;
    avances?:string;
    version?:string;
    fecha?:Date;
    estado?:string;

    constructor(data?: any) {
        if (data) {
          this.id = data.id;
          this.resumen = data.resumen;
          this.mejoras = data.mejoras;
          this.correcciones = data.correcciones;
          this.avances = data.avances;
          this.version = data.version;
          this.fecha = data.fecha;
          this.estado = data.estado;
        }
    }
}