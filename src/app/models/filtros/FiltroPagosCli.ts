export class FiltroPagosCli{
  pagina: number = 1;
  tamanioPagina: number = 15;
  total: number = 0;
  orden: string = "";
  direccion: string = "";
  idCliente?:number;

  constructor(data?: any) {
    if (data) {
      this.pagina = data.pagina;
      this.tamanioPagina = data.tamanioPagina;
      this.total = data.total;
      this.orden = data.orden;
      this.direccion = data.direccion;
      this.idCliente = data.idCliente;
    }
  }
}

