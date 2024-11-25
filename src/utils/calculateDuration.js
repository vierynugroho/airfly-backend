import { ErrorHandler } from '../middlewares/error.js';

export const calculateDuration = (departureTime, arrivalTime) => {
  const departureDate = new Date(departureTime);
  const arrivalDate = new Date(arrivalTime);

  const differenceInMs = arrivalDate - departureDate;

  if (differenceInMs < 0) {
    throw new ErrorHandler('Arrival time must be after departure time.');
  }

  const minutes = Math.floor(differenceInMs / (1000 * 60)) % 60;
  const hours = Math.floor(differenceInMs / (1000 * 60 * 60)) % 24;
  const days = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  return `${days}d ${hours}h ${minutes}m`;
};
