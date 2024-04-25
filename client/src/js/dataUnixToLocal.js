export default function dataUnixToLocal(d) {
  if (d === 0) {
    const data = "";
    return data;
  }
  const data = new Date(d * 1);

  const options = {
    year: "numeric",
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  return data.toLocaleString("it-IT", options);
}
