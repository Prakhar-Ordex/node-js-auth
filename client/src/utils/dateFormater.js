
export const formatedDate = (dateString) => {
    const date = new Date(dateString);

    // Format to include day and date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const readableDate = date.toLocaleDateString('en-US', options);
    
    return readableDate;
    
}


export function dateFormated(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }