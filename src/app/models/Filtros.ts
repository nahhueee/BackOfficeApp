export class FiltroGral{
  pagina: number = 1;
  tamanioPagina: number = 15;
  total: number = 0;
  busqueda: string = "";
  orden: string = "";
  direccion: string = "";

  constructor(data?: Partial<FiltroGral>) {
    if (data) {
      Object.assign(this, data); // Copia propiedades comunes automáticamente
    }
  }
}

export class FiltroActualizacion extends FiltroGral {
  idApp: number | null = null;

  constructor(data?: Partial<FiltroActualizacion>) {
    super(data); // Inicializa propiedades heredadas
    if (data) {
      this.idApp = data.idApp ?? null;
    }
  }
}
