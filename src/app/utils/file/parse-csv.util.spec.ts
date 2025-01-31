import { parseCsv } from './parse-csv.util';

describe('parseCsv', () => {
  it('returns `null` if the file path is `undefined` or invalid', async () => {
    expect(await parseCsv(undefined)).toBe(null);
    expect(await parseCsv('')).toBe(null);
    expect(await parseCsv('not-a-csv.pdf')).toBe(null);
  });

  // TODO: Add more unit tests after building out CSV parsing functionality
  //   it('parses the data of a valid CSV file with `skipFirstRow` set to `true`', async () => {
  //     const mockData = `
  //   id,firstName,lastName,email
  // 1,Clarette,Fulford,cfulford0@dedecms.com
  // 2,Jacinta,Uccelli,
  // 3,Celestyn,Mallett,
  // 4,Fanchette,Schanke,fschanke3@adobe.com
  // 5,Ulla,Purselow,
  // 6,Alysa,,
  // 7,Johnathon,Holsey,jholsey6@wikipedia.org
  // 8,Kingsley,McReynolds,kmcreynolds7@nasa.gov
  // 9,Helli,Hele,hhele8@java.com
  // 10,Nelson,Dungey,
  //   `;

  //     window.fetch = jest.fn().mockImplementation(() => {
  //       return new Promise(resolve => {
  //         resolve({
  //           ok: true,
  //           status: 200,
  //           json: () => mockData,
  //         });
  //       });
  //     });

  //     expect(await parseCsv('some-valid-file.csv')).toBe('tbd');
  //   });
});
