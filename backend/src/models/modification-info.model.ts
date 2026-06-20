import { IsoDate } from './core.model';

export interface ModificationInfo {
  dateCreated: IsoDate;
  createdBy: string;
  dateLastEdited: IsoDate;
  lastEditedBy: string;
}

export const modificationInfoTypes: Record<keyof ModificationInfo, string | string[]> = {
  dateCreated: 'string',
  createdBy: 'string',
  dateLastEdited: 'string',
  lastEditedBy: 'string',
};
