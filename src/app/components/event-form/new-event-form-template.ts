import moment from 'moment-timezone';

import type { EventFormData } from '@app/models';

export const newEventFormTemplate: EventFormData = {
  type: 'blitz tournament',
  eventDate: moment()
    .tz('America/Toronto', false)
    .set('hours', 18)
    .set('minutes', 0)
    .set('seconds', 0)
    .set('milliseconds', 0)
    .toISOString(),
  title: '',
  details: '',
  articleId: '',
};
