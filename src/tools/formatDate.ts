const formatDate = (date: Date, isLargeDate?: boolean) => {
  if (isLargeDate) {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString() && (date.getHours() === today.getHours() || (date.getHours() === today.getHours() - 1 && date.getMinutes() > today.getMinutes()))) {
    const difference = Math.abs(today.getTime() - date.getTime());
    const minutes = Math.floor(difference / 60000);
    return `${minutes} m`;
  } else if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }).toLowerCase();
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
}

export default formatDate;
