import { IsoDate } from './core.model';

export interface ModificationInfo {
  dateCreated: IsoDate;
  createdBy: string;
  dateLastEdited: IsoDate;
  lastEditedBy: string;
}
