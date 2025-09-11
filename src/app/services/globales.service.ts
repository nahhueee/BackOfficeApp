import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalesService {
  constructor() {}

//#region FUNCIONES FRONT
  //Metodo para Estandarizar los nros decimales
  EstandarizarDecimal(numero:string):number{
    if(numero == "") return 0;
    let formatNro = numero.replace(/\./g, '').replace(',', '.');

    return parseFloat(formatNro);
  }
//#endregion
}
