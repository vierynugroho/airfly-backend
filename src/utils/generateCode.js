import { v4 } from 'uuid';

export function generateCode() {
  const date = new Date();
  const years = (date.getFullYear() - 2000).toString();
  const month =
    date.getMonth() < 10
      ? `0${date.getMonth() + 1}`
      : (date.getMonth() + 1).toString();
  const day =
    date.getDate() < 10 ? `0${date.getDate()}` : date.getDate().toString();
  const unique = v4().substring(0, 4).toUpperCase();

  return `${years}${month}${day}${unique}`;
}
