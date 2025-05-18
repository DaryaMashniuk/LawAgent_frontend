export const parseDocumentDetails = (details) => {
  const numberMatch = details.match(/(?<=№\s)\S+/);
    const dateMatch = details.match(/от\s+(\d{1,2}\s+[а-я]+\s+\d{4})/i);
    
    return {
      number: numberMatch ? numberMatch[0] : 'Н/Д',
      date: dateMatch ? dateMatch[1] : 'Дата не указана'
    };
  };