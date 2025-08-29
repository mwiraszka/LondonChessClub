import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_PGNS } from '@app/mocks/pgns.mock';
import { queryTextContent } from '@app/utils';
import * as pgnUtils from '@app/utils';

import { PgnViewerComponent } from './pgn-viewer.component';

describe('PgnViewerComponent', () => {
  let fixture: ComponentFixture<PgnViewerComponent>;
  let component: PgnViewerComponent;

  let consoleWarnSpy: jest.SpyInstance;
  let getPlayerNameSpy: jest.SpyInstance;
  let getScoreSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgnViewerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PgnViewerComponent);
    component = fixture.componentInstance;

    consoleWarnSpy = jest.spyOn(console, 'warn');
    getPlayerNameSpy = jest.spyOn(pgnUtils, 'getPlayerName');
    getScoreSpy = jest.spyOn(pgnUtils, 'getScore');

    component.index = 1;
    component.label = 'test-game';
    component.pgn = MOCK_PGNS[0];

    fixture.detectChanges();
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
        'https://lichess.org/analysis/pgn/1. d4 e6 2. c4 f5 3. g3 Nf6 4. Bg2 d5 5. Nf3 c6 6. O-O 1-0',
      icon: 'book-open',
    });
  });

  describe('after view init', () => {
    it('should get player names and scores from PGN', () => {
      getPlayerNameSpy.mockImplementation((_, __, color) =>
        color === 'White' ? 'Player1' : 'Player2',
      );
      getScoreSpy.mockImplementation((_, color) => (color === 'White' ? '1' : '0'));
      component.ngAfterViewInit();

      expect(getPlayerNameSpy).toHaveBeenCalledWith(MOCK_PGNS[0], 'full', 'White');
      expect(getPlayerNameSpy).toHaveBeenCalledWith(MOCK_PGNS[0], 'full', 'Black');
      expect(getScoreSpy).toHaveBeenCalledWith(MOCK_PGNS[0], 'White');
      expect(getScoreSpy).toHaveBeenCalledWith(MOCK_PGNS[0], 'Black');
    });
  });

  describe('error handling', () => {
    it('should log a warning if White player name is missing', () => {
      getPlayerNameSpy.mockImplementation((_, __, color) =>
        color === 'White' ? null : 'Player2',
      );

      component.ngAfterViewInit();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('undefined White player'),
        expect.anything(),
      );
    });

    it('should log a warning if Black player name is missing', () => {
      getPlayerNameSpy.mockImplementation((_, __, color) =>
        color === 'White' ? 'Player1' : null,
      );

      component.ngAfterViewInit();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('undefined Black player'),
        expect.anything(),
      );
    });

    it('should log a warning if White score is missing', () => {
      getScoreSpy.mockImplementation((_, color) => (color === 'White' ? null : '0'));

      component.ngAfterViewInit();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('invalid score for White'),
        expect.anything(),
      );
    });

    it('should log a warning if Black score is missing', () => {
      getScoreSpy.mockImplementation((_, color) => (color === 'White' ? '1' : null));

      component.ngAfterViewInit();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('invalid score for Black'),
        expect.anything(),
      );
    });
  });

  describe('template rendering', () => {
    it('should render link in the Link List component', () => {
      expect(queryTextContent(fixture.debugElement, 'lcc-link-list')).toContain(
        'Analyze game on Lichess',
      );
    });
  });
});
