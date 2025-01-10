// FechaUtils.ts

/**
 * Convierte una fecha en formato ISO a formato dd-mm-yy.
 * @param isoDate - La fecha en formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ).
 * @returns La fecha en formato dd-mm-yy.
 */
export function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
  
    // Formatea la fecha en dd-mm-yy
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  }
  