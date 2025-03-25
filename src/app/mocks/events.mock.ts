import moment from 'moment-timezone';

import { Event } from '@app/models';
import { generateId } from '@app/utils/common/generate-id.util';

export const MOCK_EVENTS: Event[] = [
  {
    id: generateId(),
    type: 'blitz tournament (10 mins)',
    title: 'Blitz Tournament on January 1st, 2050',
    eventDate: moment('2050-01-01').toISOString(),
    details: "Come join us for some 10 | 0 blitz on New Year's Day!",
    articleId: null,
    modificationInfo: {
      createdBy: 'Billy Bob',
      dateCreated: moment('2049-01-01').toISOString(),
      lastEditedBy: 'Jim Jones',
      dateLastEdited: moment('2049-01-15').toISOString(),
    },
  },
];
