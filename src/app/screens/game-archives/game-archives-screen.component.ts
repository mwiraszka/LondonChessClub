import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { KeyValue } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { LoaderService, MetaAndTitleService } from '@app/services';
import { GameDetails } from '@app/types';
import { getPlayerName, getPlyCount, getScore } from '@app/utils/pgn-utils';

import * as fromPgns from './pgns';

@UntilDestroy()
@Component({
  selector: 'lcc-game-archives-screen',
  templateUrl: './game-archives-screen.component.html',
  styleUrls: ['./game-archives-screen.component.scss'],
})
export class GameArchivesScreenComponent implements OnInit {
  readonly YEARS = [
    '2024',
    '2023',
    '2022',
    '2019',
    '2018',
    '2017',
    '2005',
    '2000',
    '1999',
    '1998',
    '1997',
    '1996',
    '1995',
    '1994',
    '1993',
    '1992',
    '1991',
    '1990',
    '1989',
    '1988',
    '1987',
    '1985',
    '1984',
    '1983',
    '1982',
    '1980',
    '1979',
    '1977',
    '1976',
    '1974',
  ] as const;

  allGames: Map<string, GameDetails[]> = new Map();
  filteredGames: Map<string, GameDetails[]> = new Map();
  form!: FormGroup;
  showStats: boolean = false;

  get searchResultSummaryMessage(): string {
    const allGamesCount = Array.from(this.allGames.values()).flat().length;
    const resultCount = Array.from(this.filteredGames.values()).flat().length;

    if (resultCount === 0) {
      return 'No games found 😢';
    }

    if (resultCount === allGamesCount) {
      return `Displaying all ${resultCount} games`;
    }

    return `Displaying ${resultCount} / ${allGamesCount} ${resultCount === 1 ? 'game' : 'games'} 😎`;
  }

  @ViewChild(CdkVirtualScrollViewport)
  cdkVirtualScrollViewport?: CdkVirtualScrollViewport;

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private metaAndTitleService: MetaAndTitleService,
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.cdkVirtualScrollViewport?.checkViewportSize();
  }

  trackByFn = (index: number) => index;

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Game Archives');
    this.metaAndTitleService.updateDescription(
      'A collection of games played by London Chess Club members, going all the way back to 1974.',
    );

    this.initForm();
    this.initGames();
    this.initValueChangesListeners();
    this.filterGames();
  }

  onKeydown(event: Event): void {
    const key = (event as KeyboardEvent)?.key;
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      event.preventDefault();
    }
  }

  onShowStats(): void {
    this.showStats = !this.showStats;
  }

  hasError(control: AbstractControl): boolean {
    return control.dirty && control.invalid;
  }

  getErrorMessage(): string {
    return 'Invalid input';
  }

  originalOrder = (
    a: KeyValue<string, GameDetails[]>,
    b: KeyValue<string, GameDetails[]>,
  ): number => {
    return 0;
  };

  private initForm(): void {
    this.form = this.formBuilder.group({
      name: new FormControl(''),
      asWhite: new FormControl(true),
      asBlack: new FormControl(true),
      movesMin: new FormControl('', [
        Validators.max(999),
        Validators.pattern(/^[0-9]*$/),
      ]),
      movesMax: new FormControl('', [
        Validators.max(999),
        Validators.pattern(/^[0-9]*$/),
      ]),
      resultWhiteWon: new FormControl(true),
      resultDraw: new FormControl(true),
      resultBlackWon: new FormControl(true),
      resultInconclusive: new FormControl(true),
    });
  }

  private initGames(): void {
    this.YEARS.forEach(year => {
      const pgns = fromPgns[`pgns${year}`];
      this.allGames.set(
        year,
        pgns.map(pgn => {
          return {
            pgn,
            whiteName: getPlayerName(pgn, 'White'),
            whiteScore: getScore(pgn, 'White'),
            blackName: getPlayerName(pgn, 'Black'),
            blackScore: getScore(pgn, 'Black'),
            plyCount: getPlyCount(pgn),
          };
        }),
      );
    });
  }

  private initValueChangesListeners(): void {
    this.form.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(100), untilDestroyed(this))
      .subscribe(() => this.filterGames());

    this.form.controls['asBlack'].valueChanges.subscribe(asBlack => {
      if (!asBlack && !this.form.controls['asWhite'].value) {
        this.form.controls['asWhite'].setValue(true);
      }
    });

    this.form.controls['asWhite'].valueChanges.subscribe(asWhite => {
      if (!asWhite && !this.form.controls['asBlack'].value) {
        this.form.controls['asBlack'].setValue(true);
      }
    });

    this.form.controls['resultWhiteWon'].valueChanges.subscribe(resultWhiteWon => {
      if (
        !resultWhiteWon &&
        !this.form.controls['resultDraw'].value &&
        !this.form.controls['resultBlackWon'].value &&
        !this.form.controls['resultInconclusive'].value
      ) {
        this.form.controls['resultDraw'].setValue(true);
      }
    });

    this.form.controls['resultDraw'].valueChanges.subscribe(resultDraw => {
      if (
        !resultDraw &&
        !this.form.controls['resultDraw'].value &&
        !this.form.controls['resultBlackWon'].value &&
        !this.form.controls['resultInconclusive'].value
      ) {
        this.form.controls['resultWhiteWon'].setValue(true);
      }
    });

    this.form.controls['resultBlackWon'].valueChanges.subscribe(resultBlackWon => {
      if (
        !resultBlackWon &&
        !this.form.controls['resultWhiteWon'].value &&
        !this.form.controls['resultDraw'].value &&
        !this.form.controls['resultInconclusive'].value
      ) {
        this.form.controls['resultWhiteWon'].setValue(true);
      }
    });

    this.form.controls['resultInconclusive'].valueChanges.subscribe(
      resultInconclusive => {
        if (
          !resultInconclusive &&
          !this.form.controls['resultWhiteWon'].value &&
          !this.form.controls['resultDraw'].value &&
          !this.form.controls['resultBlackWon'].value
        ) {
          this.form.controls['resultWhiteWon'].setValue(true);
        }
      },
    );
  }

  private filterGames(): void {
    this.loaderService.setIsLoading(true);

    const name = this.form.value['name']?.toLowerCase();
    const pliesMin = this.form.value['movesMin'] * 2;
    const pliesMax = this.form.value['movesMax'] * 2;
    const asWhite = this.form.value['asWhite'];
    const asBlack = this.form.value['asBlack'];
    const resultWhiteWon = this.form.value['resultWhiteWon'];
    const resultDraw = this.form.value['resultDraw'];
    const resultBlackWon = this.form.value['resultBlackWon'];
    const resultInconclusive = this.form.value['resultInconclusive'];

    this.filteredGames = new Map();
    this.allGames.forEach((games, year) => {
      const filteredGames = games
        .filter(game => {
          if (!name) {
            return true;
          }
          return (
            name !== '' &&
            ((asWhite && game.whiteName?.toLowerCase().includes(name)) ||
              (asBlack && game.blackName?.toLowerCase().includes(name)))
          );
        })
        .filter(game => {
          if (game.plyCount === undefined || !pliesMax) {
            return true;
          }
          return game.plyCount <= pliesMax;
        })
        .filter(game => {
          if (game.plyCount === undefined || !pliesMin) {
            return true;
          }
          return game.plyCount >= pliesMin;
        })
        .filter(game => {
          return (
            (resultWhiteWon && game.whiteScore === '1') ||
            (resultDraw && game.whiteScore === '1/2' && game.blackScore === '1/2') ||
            (resultBlackWon && game.blackScore === '1') ||
            (resultInconclusive && (game.whiteScore === '*' || game.blackScore === '*'))
          );
        });
      this.filteredGames.set(year, filteredGames);
    });

    this.loaderService.setIsLoading(false);
  }
}
