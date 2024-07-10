import { contactTypeList } from '../constans/contactTypeList.js';

const parseBoolean = (value) => {
  if (typeof value !== 'string') return;
  if (!['true', 'false'].includes(value)) return;
  const parseValue = Boolean(value);
  return parseValue;
};

const parseFilterContactsParams = ({ contactType, isFavourite }) => {
  const parsedType = contactTypeList.includes(contactType) ? contactType : null;
  const parsedIsFavourite = parseBoolean(isFavourite);
  return {
    contactType: parsedType,
    isFavourite: parsedIsFavourite,
  };
};

export default parseFilterContactsParams;
