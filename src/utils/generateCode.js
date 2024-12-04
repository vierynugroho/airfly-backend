import { v4 } from 'uuid';

export function generateCode() {
  const date = new Date();
  const years = (date.getFullYear() - 2000).toString();
  const month =
    date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth().toString();
  const day =
    date.getDay() < 10 ? `0${date.getDay()}` : date.getDay().toString();
  const unique = v4().substring(0, 4).toUpperCase();

  return `${years}${month}${day}${unique}`;
}
