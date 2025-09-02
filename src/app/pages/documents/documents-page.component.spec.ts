import { Subject } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DialogService, MetaAndTitleService, RoutingService } from '@app/services';
import { query } from '@app/utils';

import { DocumentsPageComponent } from './documents-page.component';

describe('DocumentsPageComponent', () => {
  let fixture: ComponentFixture<DocumentsPageComponent>;
  let component: DocumentsPageComponent;

  let dialogService: DialogService;
  let metaAndTitleService: MetaAndTitleService;
  let routingService: RoutingService;

  let dialogOpenSpy: jest.SpyInstance;
  let removeFragmentSpy: jest.SpyInstance;
  let updateDescriptionSpy: jest.SpyInstance;
  let updateTitleSpy: jest.SpyInstance;

  const fragment$ = new Subject<string | null>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsPageComponent],
      providers: [
        {
          provide: DialogService,
          useValue: {
            open: jest.fn(),
            closeAll: jest.fn(),
            topDialogRef: null,
          },
        },
        {
          provide: Document,
          useValue: {
            location: {
              pathname: '/',
            },
          },
        },
        {
          provide: MetaAndTitleService,
          useValue: {
            updateTitle: jest.fn(),
            updateDescription: jest.fn(),
          },
        },
        {
          provide: RoutingService,
          useValue: {
            fragment$,
            removeFragment: jest.fn(),
          },
        },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentsPageComponent);
    component = fixture.componentInstance;

    dialogService = TestBed.inject(DialogService);
    metaAndTitleService = TestBed.inject(MetaAndTitleService);
    routingService = TestBed.inject(RoutingService);

    dialogOpenSpy = jest.spyOn(dialogService, 'open');
    removeFragmentSpy = jest.spyOn(routingService, 'removeFragment');
    updateDescriptionSpy = jest.spyOn(metaAndTitleService, 'updateDescription');
    updateTitleSpy = jest.spyOn(metaAndTitleService, 'updateTitle');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should set current path from document location', () => {
      expect(component.currentPath).toBe('/');
    });

    it('should have predefined documents array', () => {
      expect(component.documents).toHaveLength(6);
      expect(component.documents[0].title).toBe('Club Bylaws');
      expect(component.documents[0].fileName).toBe('lcc-bylaws.pdf');
    });

    it('should set meta title and description', () => {
      expect(updateTitleSpy).toHaveBeenCalledTimes(1);
      expect(updateDescriptionSpy).toHaveBeenCalledTimes(1);
      expect(updateTitleSpy).toHaveBeenCalledWith('Documents');
    });
  });

  describe('fragment subscription', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should open document corresponding to the fragment and remove the fragment when the dialog closes', async () => {
      dialogOpenSpy.mockResolvedValue('cancel');

      fragment$.next('lcc-bylaws.pdf');
      await fixture.whenStable();

      expect(dialogOpenSpy).toHaveBeenCalledTimes(1);
      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: expect.any(Function),
        isModal: true,
        inputs: { documentPath: 'assets/documents/lcc-bylaws.pdf' },
      });
      expect(removeFragmentSpy).toHaveBeenCalledTimes(1);
    });

    it('should not open document viewer when fragment does not match existing document', () => {
      fragment$.next('non-existent-document.pdf');

      expect(dialogOpenSpy).not.toHaveBeenCalled();
      expect(removeFragmentSpy).not.toHaveBeenCalled();
    });

    it('should not open document viewer when fragment is null', () => {
      fragment$.next(null);

      expect(dialogOpenSpy).not.toHaveBeenCalled();
      expect(removeFragmentSpy).not.toHaveBeenCalled();
    });

    it('should not open document viewer when top dialog is already open', async () => {
      Object.defineProperty(dialogService, 'topDialogRef', {
        value: {},
        configurable: true,
      });

      fragment$.next('lcc-bylaws.pdf');
      await fixture.whenStable();

      expect(dialogOpenSpy).not.toHaveBeenCalled();
      expect(removeFragmentSpy).not.toHaveBeenCalled();
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render page header', () => {
      expect(query(fixture.debugElement, 'lcc-page-header')).toBeTruthy();
    });

    it('should render all documents in the table', () => {
      const documentRows = fixture.debugElement.queryAll(
        selector => selector.name === 'tr' && selector.parent?.name === 'tbody',
      );

      expect(documentRows).toHaveLength(component.documents.length);
    });

    it('should render document labels with router links', () => {
      const documentLabels = fixture.debugElement.queryAll(
        selector => selector.classes['document-label-container'],
      );

      expect(documentLabels).toHaveLength(component.documents.length);
    });
  });
});
