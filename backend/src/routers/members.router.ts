import { Router } from 'express';

import {
  addMember,
  deleteMember,
  getMember,
  getMembers,
  updateMember,
  updateMembers,
} from '../controllers/members.controller';
import { auth } from '../middlewares/auth.index';

export const publicMembersRouter = Router().get('/', getMembers('public'));

export const adminMembersRouter = Router()
  .get('/', auth, getMembers('admin'))
  .get('/:id', auth, getMember)
  .post('/', auth, addMember)
  .put('/', auth, updateMembers)
  .put('/:id', auth, updateMember)
  .delete('/:id', auth, deleteMember);
