import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MOCK_MODIFICATION_INFOS } from '@app/mocks/modification-info.mock';
import { FormatDatePipe } from '@app/pipes';
import { formatDate, query, queryTextContent } from '@app/utils';

import { ModificationInfoComponent } from './modification-info.component';

describe('ModificationInfoComponent', () => {
  let fixture: ComponentFixture<ModificationInfoComponent>;
  let component: ModificationInfoComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormatDatePipe, ModificationInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModificationInfoComponent);
    component = fixture.componentInstance;

    component.info = MOCK_MODIFICATION_INFOS[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template rendering', () => {
    it('should render correct creation information', () => {
      const createDetails = query(fixture.debugElement, '.create-details-container');

      expect(queryTextContent(createDetails, 'mat-icon')).toBe('post_add');
      expect(queryTextContent(createDetails, '.name')).toBe(
        MOCK_MODIFICATION_INFOS[0].createdBy,
      );
      expect(queryTextContent(createDetails, '.date')).toBe(
        formatDate(MOCK_MODIFICATION_INFOS[0].dateCreated, 'short'),
      );
    });

    it('should render correct edit information when creation and edit dates are different', () => {
      const editDetails = query(fixture.debugElement, '.edit-details-container');

      expect(queryTextContent(editDetails, 'mat-icon')).toBe('edit');
      expect(queryTextContent(editDetails, '.name')).toBe(
        MOCK_MODIFICATION_INFOS[0].lastEditedBy,
      );
      expect(queryTextContent(editDetails, '.date')).toBe(
        formatDate(MOCK_MODIFICATION_INFOS[0].dateLastEdited, 'short'),
      );
    });

    it('should not render edit information when creation and edit dates are the same', () => {
      fixture.componentRef.setInput('info', MOCK_MODIFICATION_INFOS[4]);
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.edit-details-container')).toBeFalsy();
    });
  });
});
