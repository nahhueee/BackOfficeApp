export class ErrorAgregado {
  codigo:                 string;
  cantidadTotal:          number;
  instalacionesAfectadas: number;
  primeraOcurrencia:      Date | null;
  ultimaOcurrencia:       Date | null;

  constructor(data?: any) {
    this.codigo                 = data?.codigo                  ?? '';
    this.cantidadTotal          = data?.cantidad_total           ?? 0;
    this.instalacionesAfectadas = data?.instalaciones_afectadas  ?? 0;
    this.primeraOcurrencia      = data?.primera_ocurrencia ? new Date(data.primera_ocurrencia) : null;
    this.ultimaOcurrencia       = data?.ultima_ocurrencia  ? new Date(data.ultima_ocurrencia)  : null;
  }
}

export class ErrorDetalle {
  cliente:           string;
  DNI:               number;
  cantidad:          number;
  primeraOcurrencia: Date | null;
  ultimaOcurrencia:  Date | null;
  mensaje:           string | null;

  constructor(data?: any) {
    this.cliente           = data?.cliente            ?? '';
    this.DNI               = data?.DNI                ?? 0;
    this.cantidad          = data?.cantidad            ?? 0;
    this.primeraOcurrencia = data?.primera_ocurrencia ? new Date(data.primera_ocurrencia) : null;
    this.ultimaOcurrencia  = data?.ultima_ocurrencia  ? new Date(data.ultima_ocurrencia)  : null;
    this.mensaje           = data?.mensaje             ?? null;
  }
}
