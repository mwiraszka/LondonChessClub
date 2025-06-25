import { ComponentFixture, TestBed } from '@angular/core/testing';

import { queryTextContent } from '@app/utils';
import * as playerUtils from '@app/utils/pgn/get-player-name.util';
import * as scoreUtils from '@app/utils/pgn/get-score.util';

import { PgnViewerComponent } from './pgn-viewer.component';

describe('PgnViewerComponent', () => {
  let fixture: ComponentFixture<PgnViewerComponent>;
  let component: PgnViewerComponent;

  jest
    .spyOn(playerUtils, 'getPlayerName')
    .mockImplementation((_, __, color) => (color === 'White' ? 'Player1' : 'Player2'));
  jest
    .spyOn(scoreUtils, 'getScore')
    .mockImplementation((_, color) => (color === 'White' ? '1' : '0'));

  const samplePgn = `[Event "Chess Game"]
[Site "London"]
[Date "2023.01.01"]
[Round "1"]
[White "One, Player"]
[Black "Two, Player"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O 1-0`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgnViewerComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PgnViewerComponent);
        component = fixture.componentInstance;

        component.index = 1;
        component.label = 'test-game';
        component.pgn = samplePgn;

        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate a unique viewer ID based on label and index', () => {
    expect(component.viewerId).toBe('pgn-viewer--test-game--1');
  });

  it('should create a analysis board link with correct data', () => {
    expect(component.lichessAnalysisBoardLink).toEqual({
      text: 'Analyze game on Lichess',
      externalPath:
        'https://lichess.org/analysis/pgn/1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O 1-0',
      icon: 'book-open',
    });
  });

  it('should render link in the Link List component', () => {
    expect(queryTextContent(fixture.debugElement, 'lcc-link-list')).toContain(
      'Analyze game on Lichess',
    );
  });

  describe('after view init', () => {
    it('should get player names and scores from PGN', () => {
      expect(playerUtils.getPlayerName).toHaveBeenCalledWith(samplePgn, 'full', 'White');
      expect(playerUtils.getPlayerName).toHaveBeenCalledWith(samplePgn, 'full', 'Black');
      expect(scoreUtils.getScore).toHaveBeenCalledWith(samplePgn, 'White');
      expect(scoreUtils.getScore).toHaveBeenCalledWith(samplePgn, 'Black');
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation();
    });

    it('should log an error if White player name is missing', () => {
      jest
        .spyOn(playerUtils, 'getPlayerName')
        // @ts-expect-error Intentional type error
        .mockImplementation((pgn, _, color) => (color === 'White' ? null : 'Player2'));

      component.ngAfterViewInit();

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('A game with no defined White player was found'),
        expect.anything(),
      );
    });

    it('should log an error if Black player name is missing', () => {
      jest
        .spyOn(playerUtils, 'getPlayerName')
        // @ts-expect-error Intentional type error
        .mockImplementation((pgn, _, color) => (color === 'White' ? 'Player1' : null));

      component.ngAfterViewInit();

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('A game with no defined Black player was found'),
        expect.anything(),
      );
    });

    it('should log an error if White score is missing', () => {
      jest
        .spyOn(scoreUtils, 'getScore')
        // @ts-expect-error Intentional type error
        .mockImplementation((_, color) => (color === 'White' ? null : '0'));

      component.ngAfterViewInit();

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('A game with no valid score for White was found'),
        expect.anything(),
      );
    });

    it('should log an error if Black score is missing', () => {
      jest
        .spyOn(scoreUtils, 'getScore')
        // @ts-expect-error Intentional type error
        .mockImplementation((_, color) => (color === 'White' ? '1' : null));

      component.ngAfterViewInit();

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('A game with no valid score for Black was found'),
        expect.anything(),
      );
    });
  });
});
