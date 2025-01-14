import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { debounceTime, distinctUntilChanged, take } from 'rxjs/operators';

import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ExpansionPanelComponent } from '@app/components/expansion-panel/expansion-panel.component';
import { PgnViewerComponent } from '@app/components/pgn-viewer/pgn-viewer.component';
import { ScreenHeaderComponent } from '@app/components/screen-header/screen-header.component';
import { TooltipDirective } from '@app/components/tooltip/tooltip.directive';
import IconsModule from '@app/icons';
import type { FilterFormGroup, GameDetails } from '@app/models';
import { ChessOpeningsService, LoaderService, MetaAndTitleService } from '@app/services';
import { AppSelectors } from '@app/store/app';
import {
  getOpeningTallies,
  getPlayerName,
  getPlyCount,
  getResultTallies,
  getScore,
} from '@app/utils';

import * as fromPgns from './pgns';
import { YEARS } from './years';

@UntilDestroy()
@Component({
  selector: 'lcc-game-archives-screen',
  templateUrl: './game-archives-screen.component.html',
  styleUrl: './game-archives-screen.component.scss',
  imports: [
    BaseChartDirective,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    CdkVirtualScrollViewport,
    CommonModule,
    ExpansionPanelComponent,
    IconsModule,
    KeyValuePipe,
    PgnViewerComponent,
    ReactiveFormsModule,
    ScreenHeaderComponent,
    TooltipDirective,
  ],
})
export class GameArchivesScreenComponent implements OnInit {
  public allGames: Map<string, GameDetails[]> = new Map();
  public chessOpenings: Map<string, string> | null = null;
  public filteredGames: Map<string, GameDetails[]> = new Map();
  public form!: FormGroup<FilterFormGroup>;
  public openingChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [];
  public openingChartLabels: string[] = [];
  public openingChartOptions: ChartConfiguration<'doughnut'>['options'] = {};
  public resultChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [];
  public resultChartLabels: string[] = [];
  public resultChartOptions: ChartConfiguration<'doughnut'>['options'] = {};
  public showStats = false;

  public get searchResultSummaryMessage(): string {
    const allGamesCount = Array.from(this.allGames.values()).flat().length;
    const filteredGameCount = this.filteredGameCount;

    if (filteredGameCount === 0) {
      return 'No games found 😢';
    }

    if (filteredGameCount === allGamesCount) {
      return `Displaying all ${filteredGameCount} games`;
    }

    return `Displaying ${filteredGameCount} / ${allGamesCount} ${filteredGameCount === 1 ? 'game' : 'games'} 😎`;
  }

  public get filteredGameCount(): number {
    return Array.from(this.filteredGames.values()).flat().length;
  }

  @ViewChild(CdkVirtualScrollViewport)
  public cdkVirtualScrollViewport?: CdkVirtualScrollViewport;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private chessOpeningsService: ChessOpeningsService,
    private loaderService: LoaderService,
    private readonly metaAndTitleService: MetaAndTitleService,
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.cdkVirtualScrollViewport?.checkViewportSize();
  }

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('Game Archives');
    this.metaAndTitleService.updateDescription(
      'A collection of games played by London Chess Club members, going all the way back to 1974.',
    );

    this.initForm();
    this.initGames();
    this.initFormValueChangeListeners();
    this.initDarkModeListener();
    this.loadChessOpenings();
    this.filterGames();
  }

  public trackByFn = (index: number) => index;

  public onKeydown(event: Event): void {
    const key = (event as KeyboardEvent)?.key;
    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      event.preventDefault();
    }
  }

  public hasError(control: AbstractControl): boolean {
    return control.dirty && control.invalid;
  }

  public originalOrder = (): number => {
    return 0;
  };

  private initForm(): void {
    this.form = this.formBuilder.group({
      firstName: new FormControl('', { nonNullable: true }),
      lastName: new FormControl('', { nonNullable: true }),
      asWhite: new FormControl(true, { nonNullable: true }),
      asBlack: new FormControl(true, { nonNullable: true }),
      movesMin: new FormControl('', {
        nonNullable: true,
        validators: [Validators.max(999), Validators.pattern(/^[0-9]*$/)],
      }),
      movesMax: new FormControl('', {
        nonNullable: true,
        validators: [Validators.max(999), Validators.pattern(/^[0-9]*$/)],
      }),
      resultWhiteWon: new FormControl(true, { nonNullable: true }),
      resultDraw: new FormControl(true, { nonNullable: true }),
      resultBlackWon: new FormControl(true, { nonNullable: true }),
      resultInconclusive: new FormControl(true, { nonNullable: true }),
    });
  }

  private initGames(): void {
    YEARS.forEach(year => {
      const pgns = fromPgns[`pgns${year}`];
      this.allGames.set(
        year,
        pgns.map(pgn => {
          return {
            pgn,
            whiteFirstName: getPlayerName(pgn, 'first', 'White'),
            whiteLastName: getPlayerName(pgn, 'last', 'White'),
            whiteScore: getScore(pgn, 'White'),
            blackFirstName: getPlayerName(pgn, 'first', 'Black'),
            blackLastName: getPlayerName(pgn, 'last', 'Black'),
            blackScore: getScore(pgn, 'Black'),
            plyCount: getPlyCount(pgn),
          };
        }),
      );
    });
  }

  private initFormValueChangeListeners(): void {
    this.form.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(250), untilDestroyed(this))
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

  private initDarkModeListener(): void {
    this.store
      .select(AppSelectors.selectIsDarkMode)
      .pipe(untilDestroyed(this))
      .subscribe(isDarkMode => {
        this.openingChartOptions = {
          responsive: false,
          color: isDarkMode ? '#bbb' : '#222',
        };

        this.resultChartOptions = {
          responsive: false,
          color: isDarkMode ? '#bbb' : '#222',
        };
      });
  }

  private loadChessOpenings(): void {
    this.chessOpeningsService
      .fetchOpenings()
      .pipe(take(1))
      .subscribe(openings => {
        this.chessOpenings = openings;
        this.updateStats(this.filteredGames);
      });
  }

  private async filterGames(): Promise<void> {
    this.loaderService.setIsLoading(true);

    const firstName = this.form.value['firstName']?.toLowerCase();
    const lastName = this.form.value['lastName']?.toLowerCase();
    const pliesMin = Number(this.form.value['movesMin']) * 2;
    const pliesMax = Number(this.form.value['movesMax']) * 2;
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
          return (
            !firstName ||
            (asWhite && game.whiteFirstName?.toLowerCase().includes(firstName)) ||
            (asBlack && game.blackFirstName?.toLowerCase().includes(firstName))
          );
        })
        .filter(game => {
          return (
            !lastName ||
            (asWhite && game.whiteLastName?.toLowerCase().includes(lastName)) ||
            (asBlack && game.blackLastName?.toLowerCase().includes(lastName))
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

    this.updateStats(this.filteredGames);

    this.loaderService.setIsLoading(false);
  }

  private updateStats(games: Map<string, GameDetails[]>): void {
    const pgns: string[] = [];
    for (const [year] of games) {
      const pgnsForThisYear = games.get(year)?.map(game => game.pgn) ?? [];
      pgns.push(...pgnsForThisYear);
    }

    const openingTallies = getOpeningTallies(pgns);
    if (!openingTallies?.size || !this.chessOpenings?.size) {
      this.openingChartLabels = [];
      this.openingChartDatasets = [];
    } else {
      this.openingChartLabels = Array.from(openingTallies.keys()).map(openingEco => {
        const opening = this.chessOpenings!.get(openingEco) ?? 'Unrecognized ECO code';
        const tally = openingTallies.get(openingEco);
        return `${opening} (${tally})`;
      });
      this.openingChartDatasets = [{ data: Array.from(openingTallies!.values()) }];
    }

    const resultTallies = getResultTallies(pgns);
    if (!resultTallies?.size) {
      this.resultChartLabels = [];
      this.resultChartDatasets = [];
    } else {
      const results = Array.from(resultTallies.keys());
      this.resultChartLabels = results.map(
        result => `${result} (${resultTallies.get(result)})`,
      );
      this.resultChartDatasets = [{ data: Array.from(resultTallies.values()) }];
      this.resultChartOptions = {
        backgroundColor: results.map(result => {
          switch (result) {
            case 'White wins':
              return '#eee';
            case 'Black wins':
              return '#111';
            case 'Draw':
              return '#555';
            case 'Inconclusive':
              return '#358';
            default:
              return '#d72';
          }
        }),
      };
    }
  }
}
