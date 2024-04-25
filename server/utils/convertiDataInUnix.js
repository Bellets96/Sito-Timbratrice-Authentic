export default function convertiDataInUnix(dataString) {
  let data = new Date(dataString);

  return data.getTime();
}
