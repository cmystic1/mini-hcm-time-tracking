export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "-";

  const date = new Date(timestamp._seconds * 1000);

  return date.toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};