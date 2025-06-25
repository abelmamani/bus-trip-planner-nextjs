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

export function formatDuration(duration: string): string {

  const [hoursStr, minsStr] = duration.split(":");
  const hours = parseInt(hoursStr, 10);
  const mins = parseInt(minsStr, 10);
  const totalMinutes = hours * 60 + mins;

  // Formatear la duración
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hora${hours > 1 ? "s" : ""}`;
  return `${hours} hora${hours > 1 ? "s" : ""} y ${mins} min`;
}