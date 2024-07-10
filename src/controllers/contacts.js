import createHttpError from 'http-errors';
import {
  addContact,
  deleteContact,
  getAllContacts,
  getContactById,
  patchContact,
} from '../services/contact.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { contactsFiledList } from '../constans/contactsFiledList.js';
import parseFilterContactsParams from '../utils/parseFilterParams.js';
export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, contactsFiledList);
  const filter = parseFilterContactsParams(req.query);

  const data = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;

  const contact = await getContactById(contactId);
  if (!contact) {
    return res.status(404).json({
      status: 404,
      message: 'Contact not found',
      data: { message: 'Contact not found' },
    });
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const addContactController = async (req, res) => {
  const contact = await addContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};
export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await patchContact(contactId, req.body, {
    // upsert: true,
  });
  if (!contact) {
    return next(
      createHttpError(404, {
        status: 404,
        message: 'Not found',
      }),
    );
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact.data,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);
  if (!contact) {
    throw errorHandler(404, 'Contact not found');
  }
  res.status(204).send();
};
