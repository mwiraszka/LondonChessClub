import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgnViewerComponent } from './pgn-viewer.component';

describe('PgnViewerComponent', () => {
  let fixture: ComponentFixture<PgnViewerComponent>;
  let component: PgnViewerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PgnViewerComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PgnViewerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  });
});
