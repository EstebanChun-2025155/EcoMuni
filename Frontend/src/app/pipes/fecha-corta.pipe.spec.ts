import { FechaCortaPipe } from './fecha-corta.pipe';

describe('FechaCortaPipe', () => {
  const pipe = new FechaCortaPipe();

  it('convierte yyyy-mm-dd en dd/mm/aaaa', () => {
    expect(pipe.transform('2026-09-23')).toBe('23/09/2026');
  });

  it('devuelve vacío con entradas nulas', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('')).toBe('');
  });

  it('devuelve la entrada intacta si no es fecha ISO', () => {
    expect(pipe.transform('23/09/2026')).toBe('23/09/2026');
  });
});
