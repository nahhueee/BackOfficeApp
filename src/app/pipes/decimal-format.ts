import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalFormat'
})
export class DecimalFormatPipe implements PipeTransform {

  transform(value: number): string {
    if (isNaN(value)) {
      return '';
    }
    // Convertir el número a un string con separadores de miles y decimales
    let formattedNumber = value.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return formattedNumber;
  }

}
