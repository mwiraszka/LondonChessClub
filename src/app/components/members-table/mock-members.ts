import type { Member } from '@app/types';

export const MOCK_MEMBERS: Member[] = [
  {
    id: '1234-1234',
    firstName: 'Test',
    lastName: 'McTesterton',
    city: 'Testville',
    rating: '1234',
    peakRating: '1235',
    dateJoined: '2020-01-01',
    isActive: true,
    chesscomUsername: 'testyMcTesterton',
    lichessUsername: 'testertonTheGreat',
    yearOfBirth: '1980',
    email: 'testy123@gmail.com',
    phoneNumber: '123-1234-1234',
    modificationInfo: {
      dateCreated: new Date('2023-01-01'),
      createdBy: 'Michal Wiraszka',
      dateLastEdited: new Date('2023-02-02'),
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
    dateJoined: '2020-01-01',
    isActive: true,
    chesscomUsername: 'iAmMiranda',
    lichessUsername: 'mirandaIsMe',
    yearOfBirth: '1990',
    email: 'miranda0174892@gmail.com',
    phoneNumber: '123-1234-1234',
    modificationInfo: {
      dateCreated: new Date('2023-03-03'),
      createdBy: 'Michal Wiraszka',
      dateLastEdited: new Date('2023-04-04'),
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
    dateJoined: '2020-01-01',
    isActive: false,
    chesscomUsername: 'mockertonJJ',
    lichessUsername: 'MockertonJJ',
    yearOfBirth: '1995',
    email: undefined,
    phoneNumber: undefined,
    modificationInfo: {
      dateCreated: new Date('2023-05-05'),
      createdBy: 'Hardik Shrestha',
      dateLastEdited: new Date('2023-06-06'),
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
    dateJoined: '2022-02-02',
    isActive: true,
    chesscomUsername: 'anotherReallyStupidlyLongName',
    lichessUsername: 'yetAnotherStupidlyLongName',
    yearOfBirth: '2005',
    email: 'i-think-its-funny-to-have-long-emails@hotmail.com',
    phoneNumber: '555-5252-2525',
    modificationInfo: {
      dateCreated: new Date('2023-05-05'),
      createdBy: 'Michal Wiraszka',
      dateLastEdited: new Date('2023-06-06'),
      lastEditedBy: 'Gerry Litchfield',
    },
  },
];
