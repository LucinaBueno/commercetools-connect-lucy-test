export const addDecimalPointToCentAmount = (centAmount: number, fractionDigits: number): number => {
  const amount = String(centAmount);
  const intAmount = amount.slice(0, (fractionDigits * -1));
  const decimalAmount = amount.slice((fractionDigits * -1), amount.length);

  return parseFloat(`${intAmount}.${decimalAmount}`);
}

export const createUUID = () : string => {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (dt + Math.random()*16)%16 | 0;
    dt = Math.floor(dt/16);
    return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}