import moment from 'moment-timezone';

import type { Member } from '@app/types';

export const MOCK_MEMBERS: Member[] = [
  {
    id: '1234-1234',
    firstName: 'Test',
    lastName: 'McTesterton',
    city: 'Testville',
    rating: '1234',
    peakRating: '1235',
    dateJoined: moment('2020-01-01').toISOString(),
    isActive: true,
    chesscomUsername: 'testyMcTesterton',
    lichessUsername: 'testertonTheGreat',
    yearOfBirth: '1980',
    email: 'testy123@gmail.com',
    phoneNumber: '123-1234-1234',
    modificationInfo: {
      dateCreated: moment('2023-01-01').toISOString(),
      createdBy: 'Michal Wiraszka',
      dateLastEdited: moment('2023-02-02').toISOString(),
      lastEditedBy: 'Michal Wiraszka',
    },
  },
  {
    id: '1234-5678',
    firstName: 'Miranda',
    lastName: 'Mockington',
    city: 'London',
    rating: '1234',
    peakRating: '1235',
    dateJoined: moment('2020-01-01').toISOString(),
    isActive: true,
    chesscomUsername: 'iAmMiranda',
    lichessUsername: 'mirandaIsMe',
    yearOfBirth: '1990',
    email: 'miranda0174892@gmail.com',
    phoneNumber: '123-1234-1234',
    modificationInfo: {
      dateCreated: moment('2023-03-03').toISOString(),
      createdBy: 'Michal Wiraszka',
      dateLastEdited: moment('2023-04-04').toISOString(),
      lastEditedBy: 'Michal Wiraszka',
    },
  },
  {
    id: '1234-5679',
    firstName: 'John James',
    lastName: 'Mockerton',
    city: 'London',
    rating: '1234',
    peakRating: '1235',
    dateJoined: moment('2020-01-01').toISOString(),
    isActive: false,
    chesscomUsername: 'mockertonJJ',
    lichessUsername: 'MockertonJJ',
    yearOfBirth: '1995',
    email: null,
    phoneNumber: null,
    modificationInfo: {
      dateCreated: moment('2023-05-05').toISOString(),
      createdBy: 'Hardik Shrestha',
      dateLastEdited: moment('2023-06-06').toISOString(),
      lastEditedBy: 'Gerry Litchfield',
    },
  },
  {
    id: '1234-6000',
    firstName: 'OutrageouslyLongName',
    lastName: 'McLonglastnamerston',
    city: 'Sault Saint Marie',
    rating: '800/5',
    peakRating: '1000',
    dateJoined: moment('2022-02-02').toISOString(),
    isActive: true,
    chesscomUsername: 'anotherReallyStupidlyLongName',
    lichessUsername: 'yetAnotherStupidlyLongName',
    yearOfBirth: '2005',
    email: 'i-think-its-funny-to-have-long-emails@hotmail.com',
    phoneNumber: '555-5252-2525',
    modificationInfo: {
      dateCreated: moment('2023-05-05').toISOString(),
      createdBy: 'Michal Wiraszka',
      dateLastEdited: moment('2023-06-06').toISOString(),
      lastEditedBy: 'Gerry Litchfield',
    },
  },
];
