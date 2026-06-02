/**
 * @param {string} startsAt - ISO timestamp
 * @param {string|null} endsAt - ISO timestamp
 * @param {string|null} location
 * @returns {string}
 */
export function formatEventMeta(startsAt, endsAt, location) {
  const parts = [];

  const startsAtDate = new Date(startsAt);
  if (!Number.isNaN(startsAtDate.getTime())) {
    parts.push(
      startsAtDate.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    );

    const timeLabel = [startsAtDate, endsAt ? new Date(endsAt) : null]
      .filter((date) => date && !Number.isNaN(date.getTime()))
      .map((date) =>
        date.toLocaleTimeString(undefined, {
          hour: 'numeric',
          minute: '2-digit',
        })
      )
      .join(' - ');

    if (timeLabel) {
      parts.push(timeLabel);
    }
  } else if (startsAt) {
    parts.push(startsAt);
  }

  if (location) {
    parts.push(location);
  }

  return parts.join(' · ');
}
