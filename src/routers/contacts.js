import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  addContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  patchContactController,
} from '../controllers/contacts.js';
import { validateBody } from '../middleware/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
const contactRouter = Router();
contactRouter.get('/contacts', ctrlWrapper(getAllContactsController));

contactRouter.get(
  '/contacts/:contactId',

  ctrlWrapper(getContactByIdController),
);
contactRouter.post(
  '/contacts',
  validateBody(createContactSchema),
  ctrlWrapper(addContactController),
);
contactRouter.patch(
  '/contacts/:contactId',
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);
contactRouter.delete(
  '/contacts/:contactId',

  ctrlWrapper(deleteContactController),
);
export default contactRouter;
