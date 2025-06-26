import { PdfViewerModule } from 'ng2-pdf-viewer';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentViewerComponent } from './document-viewer.component';

describe('DocumentViewerComponent', () => {
  let fixture: ComponentFixture<DocumentViewerComponent>;
  let component: DocumentViewerComponent;

  const mockDocumentPath = 'assets/documents/test-document.pdf';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfViewerModule, DocumentViewerComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(DocumentViewerComponent);
        component = fixture.componentInstance;
        component.documentPath = mockDocumentPath;
        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate percentLoaded correctly when onProgress is called', () => {
    component.onProgress({ loaded: 75, total: 100 });
    expect(component.percentLoaded).toBe(75);
  });

  it('should not change percentLoaded if total progress is negative or zero', () => {
    component.onProgress({ loaded: 2, total: 100 });
    expect(component.percentLoaded).toBe(2);

    component.onProgress({ loaded: 10, total: -1 });
    expect(component.percentLoaded).toBe(2);
  });

  it('should not change percentLoaded if loaded progress exceeds loaded progress', () => {
    component.onProgress({ loaded: 5, total: 100 });
    expect(component.percentLoaded).toBe(5);

    component.onProgress({ loaded: 150, total: 100 });
    expect(component.percentLoaded).toBe(5);
  });

  it('should have a loading progress indicator with correct width', () => {
    component.percentLoaded = 42;
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.loading-progress-indicator').style.width,
    ).toBe('42%');
  });
});
