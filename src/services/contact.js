import { ContactCollection } from '../db/models/contact.js';
import { callculatedPaginationData } from '../utils/calculatedPginationData.js';
export const getAllContacts = async ({
  page,
  perPage,
  sortBy = '_id',
  sortOrder = 'asc',
  filter,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const contactsQuery = ContactCollection.find();

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }
  const contacts = await contactsQuery
    .find()
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder });
  const totalItems = await ContactCollection.find()
    .merge(contactsQuery)
    .where('isFavourite')
    .equals(filter.isFavourite)
    .countDocuments();

  const { totalPages, hasNextPage, hasPreviousPage } =
    callculatedPaginationData({
      total: totalItems,
      perPage,
      page,
    });

  return {
    contacts,
    page,
    perPage,
    totalItems,

    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};

export const getContactById = async (contactId) => {
  const contact = await ContactCollection.findById(contactId);
  return contact;
};
export const addContact = async (data) => {
  const contact = await ContactCollection.create(data);
  return contact;
};
export const patchContact = async (contactId, data, options = {}) => {
  const contact = await ContactCollection.findOneAndUpdate(
    { _id: contactId },
    data,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  if (!contact || !contact.value) return null;
  return {
    data: contact.value,
    isNew: Boolean(contact?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (contactId) =>
  ContactCollection.findOneAndDelete({ _id: contactId });
