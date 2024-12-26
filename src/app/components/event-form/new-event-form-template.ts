import moment from 'moment-timezone';

import type { EventFormData } from '@app/types';

export const newEventFormTemplate: EventFormData = {
  type: 'blitz tournament',
  eventDate: moment()
    .tz('America/Toronto', false)
    .set('hours', 18)
    .set('minutes', 0)
    .toISOString(),
  title: '',
  details: '',
  articleId: '',
};
