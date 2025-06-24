export function getTotalDuration(horaFin: string, horaInicio: string): string {
  const [hFin, mFin] = horaFin.split(':').map(Number);
  const [hInicio, mInicio] = horaInicio.split(':').map(Number);
  
  const minutosFin = hFin * 60 + mFin;
  const minutosInicio = hInicio * 60 + mInicio;
  
  let diferencia = minutosFin - minutosInicio;
  
  if (diferencia < 0) {
    diferencia += 24 * 60; // Sumar 24 horas
  }

  const horas = Math.floor(diferencia / 60);
  const minutos = diferencia % 60;
  
  return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
}
