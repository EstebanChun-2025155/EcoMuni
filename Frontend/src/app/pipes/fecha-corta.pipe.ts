import { Pipe, PipeTransform } from '@angular/core';

/**
 * Fecha corta: convierte `yyyy-mm-dd` en `dd/mm/aaaa`.
 *
 * Es un pipe puro: Angular memoriza el resultado y solo lo recalcula
 * cuando cambia la entrada, a diferencia de llamar a un método en la
 * plantilla (que se ejecuta en cada ciclo de detección de cambios).
 */
@Pipe({ name: 'fechaCorta', standalone: true })
export class FechaCortaPipe implements PipeTransform {
  transform(fecha: string | null | undefined): string {
    if (!fecha) return '';
    const [anio, mes, dia] = fecha.split('-');
    return anio && mes && dia ? `${dia}/${mes}/${anio}` : fecha;
  }
}
