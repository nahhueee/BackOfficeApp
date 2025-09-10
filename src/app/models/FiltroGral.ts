export class FiltroGral{
  pagina: number = 1;
  tamanioPagina: number = 15;
  total: number = 0;
  busqueda: string = "";
  orden: string = "";
  direccion: string = "";

  constructor(data?: any) {
    if (data) {
      this.pagina = data.pagina;
      this.tamanioPagina = data.tamanioPagina;
      this.total = data.total;
      this.busqueda = data.busqueda;
      this.orden = data.orden;
      this.direccion = data.direccion;
    }
  }
}

