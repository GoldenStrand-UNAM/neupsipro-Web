function validatePeerSession (session) {
  const errors = [];

  // responsable
  if (!session.responsable)
    errors.push('El responsable es obligatorio');
  else if (session.responsable.length > 80)
    errors.push('El responsable no puede exceder 80 caracteres');

  // title
  if (!session.title)
    errors.push('El título es obligatorio');
  else if (session.title.length > 100)
    errors.push('El título no puede exceder 100 caracteres');

  // note
  if (session.note && session.note.length > 500)
    errors.push('La nota no puede exceder 500 caracteres');

  // date
  let isoDate = null;
  if (!session.session_date) {
    errors.push('La fecha es obligatoria');
  } else {
    const [day, month, year] = session.session_date.split('/').map(Number);
    const inputDate = new Date(year, month - 1, day);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (Number.isNaN(inputDate.getTime()) || !day || !month || !year) {
      errors.push('La fecha no es válida');
    } else if (inputDate > now || year < 1900) {
      errors.push('La fecha debe ser válida, anterior o igual a hoy y posterior a 1900');
    } else {
      const mm = String(month).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      isoDate = `${year}-${mm}-${dd}`;
    }
  }

  // count
  const men = Number(session.men_count);
  const women = Number(session.women_count);

  if (!Number.isInteger(men) || men < 0 || men > 999)
    errors.push('El conteo de hombres debe ser un entero entre 0 y 999');
  if (!Number.isInteger(women) || women < 0 || women > 999)
    errors.push('El conteo de mujeres debe ser un entero entre 0 y 999');

  if (Number.isInteger(men) && Number.isInteger(women) && men + women === 0)
    errors.push('La sesión debe tener al menos un asistente');

  if (errors.length > 0)
    throw new Error(errors.join('. '));

  return {
    ...session,
    date: isoDate,
  };
}

module.exports = validatePeerSession;
