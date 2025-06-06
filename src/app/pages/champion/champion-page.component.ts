import { Component, OnInit } from '@angular/core';

import { LinkListComponent } from '@app/components/link-list/link-list.component';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { ImagePreloadDirective } from '@app/directives/image-preload.directive';
import IconsModule from '@app/icons';
import type { ExternalLink } from '@app/models';
import { MetaAndTitleService } from '@app/services';

@Component({
  selector: 'lcc-champion-page',
  templateUrl: './champion-page.component.html',
  styleUrl: './champion-page.component.scss',
  imports: [IconsModule, ImagePreloadDirective, LinkListComponent, PageHeaderComponent],
})
export class ChampionPageComponent implements OnInit {
  public readonly links: ExternalLink[] = [
    {
      text: 'Past London Chess Champions (1967-2019)',
      externalPath: 'http://londonchessclub.ca/?p=78',
    },
    {
      text: 'Past London Junior Chess Champions (1996-2011)',
      externalPath: 'http://londonchessclub.ca/?p=79',
    },
    {
      text: 'Past London Active Chess Champions (1994-2019)',
      externalPath: 'http://londonchessclub.ca/?p=75',
    },
    {
      text: 'Past London Speed Chess Champions (1993-2019)',
      externalPath: 'http://londonchessclub.ca/?p=72',
    },
  ];

  public readonly pastChampionships: Array<{
    year: number;
    winner: string;
    style?: string;
  }> = [
    {
      year: 2024,
      winner: 'Serhii Ivanchuk',
      style: 'font-weight: bold;',
    },
    {
      year: 2023,
      winner: 'Serhii Ivanchuk',
    },
    {
      year: 2022,
      winner: 'Geoffrey Ruelland',
    },
    {
      year: 2021,
      winner: '(Cancelled due to the pandemic)',
      style: 'font-style: italic;',
    },
    {
      year: 2020,
      winner: '(Cancelled due to the pandemic)',
      style: 'font-style: italic;',
    },
    {
      year: 2019,
      winner: 'Kevin Gibson',
    },
    {
      year: 2018,
      winner: 'Kevin Gibson',
    },
    {
      year: 2017,
      winner: 'Kevin Gibson',
    },
    {
      year: 2016,
      winner: 'Kevin Gibson',
    },
    {
      year: 2015,
      winner: 'Kevin Gibson',
    },
    {
      year: 2014,
      winner: 'Steve Demmery',
    },
    {
      year: 2013,
      winner: 'Kevin Gibson',
    },
    {
      year: 2012,
      winner: 'Kevin Gibson',
    },
    {
      year: 2011,
      winner: 'Steve Demmery',
    },
    {
      year: 2010,
      winner: 'Kevin Gibson',
    },
    {
      year: 2009,
      winner: 'Mike Coleman',
    },
    {
      year: 2008,
      winner: 'Carl Ehrman',
    },
    {
      year: 2007,
      winner: 'David Wang & Mike Coleman',
    },
    {
      year: 2006,
      winner: 'Dan Surlan',
    },
    {
      year: 2005,
      winner: 'Steve Demmery',
    },
    {
      year: 2004,
      winner: 'Jay Zendrowski',
    },
    {
      year: 2003,
      winner: 'David Jackson',
    },
    {
      year: 2002,
      winner: 'Jay Zendrowski & Steve Demmery',
    },
    {
      year: 2001,
      winner: 'Dan Surlan & Carl Ehrman',
    },
    {
      year: 2000,
      winner: 'Carl Ehrman',
    },
    {
      year: 1999,
      winner: 'Jay Zendrowski',
    },
    {
      year: 1998,
      winner: 'Carl Ehrman',
    },
    {
      year: 1997,
      winner: 'Jay Zendrowski',
    },
    {
      year: 1996,
      winner: 'Todd Southam',
    },
    {
      year: 1995,
      winner: 'Hans Jung',
    },
    {
      year: 1994,
      winner: 'Ron Pitre',
    },
    {
      year: 1993,
      winner: 'Hans Jung',
    },
    {
      year: 1992,
      winner: 'Kosta Elieff',
    },
    {
      year: 1991,
      winner: 'Jay Zendrowski',
    },
    {
      year: 1990,
      winner: 'David McTavish',
    },
    {
      year: 1989,
      winner: 'Hans Jung',
    },
    {
      year: 1988,
      winner: 'Dan Surlan',
    },
    {
      year: 1987,
      winner: 'David McTavish',
    },
    {
      year: 1986,
      winner: 'Hans Jung',
    },
    {
      year: 1985,
      winner: 'Hans Jung',
    },
    {
      year: 1984,
      winner: 'Hans Jung',
    },
    {
      year: 1983,
      winner: 'Hans Jung',
    },
    {
      year: 1982,
      winner: 'Hans Jung',
    },
    {
      year: 1981,
      winner: 'Hans Jung',
    },
    {
      year: 1980,
      winner: 'Hans Jung',
    },
    {
      year: 1979,
      winner: 'Hans Jung',
    },
    {
      year: 1978,
      winner: 'Hans Jung',
    },
    {
      year: 1977,
      winner: 'Hans Jung',
    },
    {
      year: 1976,
      winner: 'Ray Ebisuzaki',
    },
    {
      year: 1975,
      winner: 'Peter Murray',
    },
    {
      year: 1974,
      winner: 'Peter Murray',
    },
    {
      year: 1973,
      winner: 'Peter Murray',
    },
    {
      year: 1972,
      winner: 'Peter Murray',
    },
    {
      year: 1971,
      winner: 'Edward Durrant',
    },
    {
      year: 1970,
      winner: 'Edward Durrant',
    },
    {
      year: 1969,
      winner: 'John Wright',
    },
    {
      year: 1968,
      winner: 'Peter Murray',
    },
    {
      year: 1967,
      winner: 'Peter Murray',
    },
  ];

  constructor(private readonly metaAndTitleService: MetaAndTitleService) {}

  ngOnInit(): void {
    this.metaAndTitleService.updateTitle('City Champion');
    this.metaAndTitleService.updateDescription(
      'All about the London Chess Championship and past winners.',
    );
  }
}
