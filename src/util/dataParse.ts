export const dataParse = (data: any): JSON => {
  const temp = JSON.stringify(data).replace(/\|\@u003f\|/g, '?');

  return JSON.parse(temp);
};
