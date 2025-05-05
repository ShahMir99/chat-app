import { format, isToday, isYesterday } from 'date-fns';

export const formatLastSeen = (date: Date) => {

  if(!date){
    return null
  }
  
  if (isToday(date)) {
    return `Last seen today at ${format(date, 'h:mm a')}`;
  }
  
  if (isYesterday(date)) {
    return `Last seen yesterday at ${format(date, 'h:mm a')}`;
  }

  return `Last seen on ${format(date, 'MMMM dd, yyyy')}`;
};


export const formatLastMessageTime = (date : any) => {
  if (isToday(date)) {
    return format(date, 'h:mm a');
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }

  return format(date, 'MMM d'); 
}