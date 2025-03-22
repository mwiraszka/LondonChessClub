import { Id, IsoDate, Url } from './core.model';

export interface Image {
  id: Id;
  filename: string;
  fileSize: number;
  dateUploaded: IsoDate;
  presignedUrl: Url;
  articleAppearances: number;
  albums?: string[];
  albumCoverFor?: string | null;
  name?: string;
}
