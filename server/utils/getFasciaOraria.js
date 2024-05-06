export default function getFasciaOraria(ore) {
  let fasciaOraria = "";
  switch (true) {
    case ore >= 3 && ore <= 13:
      fasciaOraria = "A";
      break;
    case ore >= 14 && ore <= 19:
      fasciaOraria = "B";
      break;
    case ore >= 20 || ore <= 2:
      fasciaOraria = "C";
      break;
  }
  return fasciaOraria;
}
