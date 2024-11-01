import { format, parse } from 'date-fns';

export const formatDate = (inputDate: string) => {
  const startDate = new Date(inputDate);
  return format(startDate, 'HH:mm:ss dd-MM-yyyy');
}
export const formatDateString = (inputDate) => {
  const startDate = parse(inputDate, 'HH:mm:ss dd-MM-yyyy', new Date());
  const formattedDate = format(startDate, "dd 'Tháng' M, yyyy");
  return formattedDate;
};
export const formatDateNumber = (inputDate) => {
  const startDate = parse(inputDate, 'HH:mm:ss dd-MM-yyyy', new Date());
  const formattedDate = format(startDate, 'dd.MM.yyyy');
  return formattedDate;
};