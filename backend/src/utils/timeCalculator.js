function parseSchedule(schedule = {}) {
  const startTime = schedule.startTime ?? schedule.start ?? "09:00";
  const endTime = schedule.endTime ?? schedule.end ?? "18:00";

  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  return { startHour, startMinute, endHour, endMinute };
}

function toDateValue(value) {
  if (!value) return null;

  if (typeof value.toDate === "function") {
    return value.toDate();
  }

  return new Date(value);
}

export function calculateAttendance(timeIn, timeOut, schedule = {}) {
  const inTime = toDateValue(timeIn);
  const outTime = toDateValue(timeOut);

  if (!inTime || !outTime || Number.isNaN(inTime.getTime()) || Number.isNaN(outTime.getTime())) {
    return {
      workedMinutes: 0,
      regularHours: 0,
      overtimeHours: 0,
      lateMinutes: 0,
      undertimeMinutes: 0,
      nightDifferentialHours: 0,
      scheduledMinutes: 0,
    };
  }

  const workedMinutes = Math.max(0, Math.round((outTime - inTime) / (1000 * 60)));

  const scheduleStart = new Date(inTime);
  const scheduleEnd = new Date(inTime);
  const { startHour, startMinute, endHour, endMinute } = parseSchedule(schedule);

  scheduleStart.setHours(startHour, startMinute, 0, 0);
  scheduleEnd.setHours(endHour, endMinute, 0, 0);

  if (scheduleEnd <= scheduleStart) {
    scheduleEnd.setDate(scheduleEnd.getDate() + 1);
  }

  const scheduledMinutes = Math.max(0, Math.round((scheduleEnd - scheduleStart) / (1000 * 60)));
  const regularMinutes = Math.min(workedMinutes, scheduledMinutes);
  const overtimeMinutes = Math.max(0, workedMinutes - scheduledMinutes);
  const lateMinutes = Math.max(0, Math.round((inTime - scheduleStart) / (1000 * 60)));
  const undertimeMinutes = Math.max(0, Math.round((scheduleEnd - outTime) / (1000 * 60)));

  let nightDifferentialMinutes = 0;
  let cursor = new Date(Math.min(inTime.getTime(), outTime.getTime()));
  const endCursor = new Date(Math.max(inTime.getTime(), outTime.getTime()));

  while (cursor < endCursor) {
    const nextCursor = new Date(cursor);
    nextCursor.setMinutes(nextCursor.getMinutes() + 1);

    const hour = cursor.getHours();
    if (hour >= 22 || hour < 6) {
      nightDifferentialMinutes += 1;
    }

    cursor = nextCursor;
  }

  return {
    workedMinutes,
    regularHours: regularMinutes / 60,
    overtimeHours: overtimeMinutes / 60,
    lateMinutes,
    undertimeMinutes,
    nightDifferentialHours: nightDifferentialMinutes / 60,
    scheduledMinutes,
  };
}