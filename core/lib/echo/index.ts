export const echo = (heading: string, values: any[] = []) => {
  console.group(
    "%c" + heading,
    "background-color: #e0005a ; color: #ffffff ; font-weight: bold ; padding: 4px ;"
  );
  values.forEach((v) => console.log(v));
  console.groupEnd();
};
