export function calculateAttendance(timeIn, timeOut, schedule) {

    const inTime = new Date(timeIn);
    const outTime = new Date(timeOut);

    const workedMinutes =
        (outTime - inTime) / (1000 * 60);

    const scheduleStart = new Date(inTime);
    const scheduleEnd = new Date(inTime);

    const [startHour, startMinute] = schedule.startTime.split(":");
    const [endHour, endMinute] = schedule.endTime.split(":");

    scheduleStart.setHours(startHour, startMinute, 0);
    scheduleEnd.setHours(endHour, endMinute, 0);

    const late =
        Math.max(
            0,
            (inTime - scheduleStart) / (1000 * 60)
        );

    const undertime =
        Math.max(
            0,
            (scheduleEnd - outTime) / (1000 * 60)
        );

    const regular =
        Math.min(workedMinutes, 480);

    const overtime =
        Math.max(0, workedMinutes - 480);

    return {

        workedMinutes,

        regularHours: regular / 60,

        overtimeHours: overtime / 60,

        lateMinutes: late,

        undertimeMinutes: undertime,

        nightDifferentialHours: 0

    };

}