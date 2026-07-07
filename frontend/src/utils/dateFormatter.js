export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "-";

  let date;

  if (timestamp instanceof Date) {
    date = timestamp;
  } else if (timestamp._seconds) {
    date = new Date(timestamp._seconds * 1000);
  } else {
    date = new Date(timestamp);
  }

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};