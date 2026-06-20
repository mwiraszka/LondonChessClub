import { Router } from 'express';

import {
  addEvent,
  deleteEvent,
  getEvent,
  getEvents,
  updateEvent,
} from '../controllers/events.controller';
import { auth } from '../middlewares/auth.index';

export const eventsRouter = Router()
  .get('/', getEvents)
  .get('/:id', getEvent)
  .post('/', auth, addEvent)
  .put('/:id', auth, updateEvent)
  .delete('/:id', auth, deleteEvent);
