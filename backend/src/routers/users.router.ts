import { Router } from 'express';

import {
  changePassword,
  login,
  logout,
  refreshSession,
  sendCodeForPasswordChange,
} from '../controllers/users.controller';

export const usersRouter = Router()
  .post('/login', login)
  .post('/logout', logout)
  .post('/refresh-session', refreshSession)
  .post('/send-code', sendCodeForPasswordChange)
  .post('/change-password', changePassword);
