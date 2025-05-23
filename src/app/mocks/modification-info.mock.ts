import moment from 'moment-timezone';

import { ModificationInfo } from '@app/models';

export const MOCK_MODIFICATION_INFOS: ModificationInfo[] = [
  {
    createdBy: 'John Doe',
    dateCreated: moment('2025-01-01').toISOString(),
    lastEditedBy: 'John Doe',
    dateLastEdited: moment('2025-01-15').toISOString(),
  },
  {
    createdBy: 'El Presidente',
    dateCreated: moment('2025-01-01').toISOString(),
    lastEditedBy: 'El Vice-Presidente',
    dateLastEdited: moment('2025-01-03').toISOString(),
  },
  {
    createdBy: 'El Presidente',
    dateCreated: moment('2025-01-01T12:00:00').toISOString(),
    lastEditedBy: 'El Presidente',
    dateLastEdited: moment('2025-01-02T10:00:00').toISOString(),
  },
  {
    createdBy: 'Jack Sparrow',
    dateCreated: moment('2025-01-02T12:00:00').toISOString(),
    lastEditedBy: 'Jack Sparrow',
    dateLastEdited: moment('2025-01-02T14:00:00').toISOString(),
  },
];
