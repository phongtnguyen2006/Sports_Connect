/**
 * @param {string} date - YYYY-MM-DD
 * @param {string} time - HH:mm
 * @param {string} location
 * @returns {string}
 */
export function formatEventMeta(date, time, location) {
  const parts = [];

  if (date) {
    const parsed = new Date(`${date}T00:00:00`);
    if (!Number.isNaN(parsed.getTime())) {
      parts.push(
        parsed.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      );
    } else {
      parts.push(date);
    }
  }

  if (time) {
    const [hours, minutes] = time.split(':').map(Number);
    if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
      const dt = new Date();
      dt.setHours(hours, minutes, 0, 0);
      parts.push(
        dt.toLocaleTimeString(undefined, {
          hour: 'numeric',
          minute: '2-digit',
        })
      );
    } else {
      parts.push(time);
    }
  }

  if (location) {
    parts.push(location);
  }

  return parts.join(' · ');
}
