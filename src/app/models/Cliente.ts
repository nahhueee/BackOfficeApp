export class Cliente{
    id: number;
    DNI: number;
    nombre: string;
    email: string;
    descripcion: string;
    fechaAlta: Date;

    constructor(data: any){
        this.id = data.id;
        this.DNI = data.DNI;
        this.nombre = data.nombre;
        this.email = data.email;
        this.descripcion = data.descripcion;
        this.fechaAlta = data.fechaAlta;
    }
}