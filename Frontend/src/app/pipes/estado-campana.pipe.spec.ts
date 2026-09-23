import { EstadoCampanaPipe } from './estado-campana.pipe';
import type { EstadoCampana } from '../models/campana';

describe('EstadoCampanaPipe', () => {
  const pipe = new EstadoCampanaPipe();

  it.each([
    ['borrador', 'Borrador'],
    ['publicada', 'Publicada'],
    ['finalizada', 'Finalizada'],
    ['cancelada', 'Cancelada'],
  ] as Array<[EstadoCampana, string]>)('traduce %s como %s', (estado, esperado) => {
    expect(pipe.transform(estado)).toBe(esperado);
  });
});
