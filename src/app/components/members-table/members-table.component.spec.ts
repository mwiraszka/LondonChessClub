import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasicDialogComponent } from '@app/components/basic-dialog/basic-dialog.component';
import { AdminControlsDirective } from '@app/directives/admin-controls.directive';
import { TooltipDirective } from '@app/directives/tooltip.directive';
import { MOCK_MEMBERS } from '@app/mocks/members.mock';
import { DataPaginationOptions, Member } from '@app/models';
import { DialogService } from '@app/services';
import { formatDate, query, queryAll } from '@app/utils';

import { MembersTableComponent } from './members-table.component';

describe('MembersTableComponent', () => {
  let fixture: ComponentFixture<MembersTableComponent>;
  let component: MembersTableComponent;

  let dialogService: DialogService;

  let dialogOpenSpy: jest.SpyInstance;
  let onDeleteMemberSpy: jest.SpyInstance;
  let optionsChangeSpy: jest.SpyInstance;
  let requestDeleteMemberSpy: jest.SpyInstance;

  const mockOptions: DataPaginationOptions<Member> = {
    page: 1,
    pageSize: 10,
    sortBy: 'lastName',
    sortOrder: 'asc',
    filters: {},
    search: '',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminControlsDirective, MembersTableComponent, TooltipDirective],
      providers: [
        provideRouter([]),
        { provide: DialogService, useValue: { open: jest.fn() } },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MembersTableComponent);
        component = fixture.componentInstance;
        dialogService = TestBed.inject(DialogService);

        component.isAdmin = true;
        component.isSafeMode = false;
        component.members = MOCK_MEMBERS;
        component.options = { ...mockOptions };

        dialogOpenSpy = jest.spyOn(dialogService, 'open');
        // @ts-expect-error Private class member
        onDeleteMemberSpy = jest.spyOn(component, 'onDeleteMember');
        optionsChangeSpy = jest.spyOn(component.optionsChange, 'emit');
        requestDeleteMemberSpy = jest.spyOn(component.requestDeleteMember, 'emit');

        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should calculate startIndex correctly', () => {
      component.options = { ...mockOptions, page: 2, pageSize: 20 };
      expect(component.startIndex).toBe(21);

      component.options = { ...mockOptions, page: 1, pageSize: 10 };
      expect(component.startIndex).toBe(1);
    });
  });

  describe('table header selection', () => {
    it('should emit options with updated sortBy and sortOrder when selecting a new header', () => {
      component.onSelectTableHeader('City');

      expect(optionsChangeSpy).toHaveBeenCalledWith({
        ...mockOptions,
        sortBy: 'city',
        page: 1,
        sortOrder: 'asc',
      });
    });

    it('should toggle sortOrder when selecting the same header', () => {
      component.options = { ...mockOptions, sortBy: 'city', sortOrder: 'asc' };
      component.onSelectTableHeader('City');

      expect(optionsChangeSpy).toHaveBeenCalledWith({
        ...mockOptions,
        sortBy: 'city',
        page: 1,
        sortOrder: 'desc',
      });
    });

    it('should default to descending order for rating header', () => {
      component.onSelectTableHeader('Rating');

      expect(optionsChangeSpy).toHaveBeenCalledWith({
        ...mockOptions,
        sortBy: 'rating',
        page: 1,
        sortOrder: 'desc',
      });
    });

    it('should default to descending order for peak rating header', () => {
      component.onSelectTableHeader('Peak Rating');

      expect(optionsChangeSpy).toHaveBeenCalledWith({
        ...mockOptions,
        sortBy: 'peakRating',
        page: 1,
        sortOrder: 'desc',
      });
    });

    it('should default to ascending order for last name header', () => {
      component.onSelectTableHeader('First Name');

      expect(optionsChangeSpy).toHaveBeenCalledWith({
        ...mockOptions,
        sortBy: 'firstName',
        page: 1,
        sortOrder: 'asc',
      });
    });
  });

  describe('admin controls', () => {
    it('should return correct admin controls config', () => {
      const member = MOCK_MEMBERS[0];
      const config = component.getAdminControlsConfig(member);

      expect(config.editPath).toEqual(['member', 'edit', member.id]);
      expect(config.buttonSize).toBe(31);
      expect(config.itemName).toBe(`${member.firstName} ${member.lastName}`);
      expect(config.deleteCb).toBeDefined();
    });

    it('should call onDeleteMember when deleteCb is invoked', () => {
      const member = MOCK_MEMBERS[0];
      const config = component.getAdminControlsConfig(member);

      config.deleteCb();

      expect(onDeleteMemberSpy).toHaveBeenCalledWith(member);
    });
  });

  describe('city champion', () => {
    it('should identify current city champion', () => {
      const cityChampion = {
        firstName: 'Serhii',
        lastName: 'Ivanchuk',
      } as unknown as Member;

      expect(component.isCityChampion(cityChampion)).toBe(true);
    });

    it('should not identify other members as city champion', () => {
      expect(component.isCityChampion(MOCK_MEMBERS[0])).toBe(false);
    });
  });

  describe('member deletion', () => {
    it('should open confirmation dialog and emit delete request when confirmed', async () => {
      dialogOpenSpy.mockResolvedValue('confirm');
      const member = MOCK_MEMBERS[0];

      await component['onDeleteMember'](member);

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: BasicDialogComponent,
        inputs: {
          dialog: {
            title: 'Confirm',
            body: `Delete ${member.firstName} ${member.lastName}?`,
            confirmButtonText: 'Delete',
            confirmButtonType: 'warning',
          },
        },
        isModal: true,
      });
      expect(requestDeleteMemberSpy).toHaveBeenCalledWith(member);
    });

    it('should not emit delete request when dialog is cancelled', async () => {
      jest.clearAllMocks();
      dialogOpenSpy.mockResolvedValue('cancel');
      const member = MOCK_MEMBERS[0];

      await component['onDeleteMember'](member);

      expect(dialogOpenSpy).toHaveBeenCalledWith({
        componentType: BasicDialogComponent,
        inputs: {
          dialog: {
            title: 'Confirm',
            body: `Delete ${member.firstName} ${member.lastName}?`,
            confirmButtonText: 'Delete',
            confirmButtonType: 'warning',
          },
        },
        isModal: true,
      });
      expect(requestDeleteMemberSpy).not.toHaveBeenCalled();
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      component.members = MOCK_MEMBERS.slice(0, 3);
      fixture.detectChanges();
    });

    it('should render admin table headers when isAdmin is true', () => {
      component.isAdmin = true;
      fixture.detectChanges();

      const headers = queryAll(fixture.debugElement, 'th');
      expect(headers.length).toBe(component.ADMIN_TABLE_HEADERS.length + 1);
    });

    it('should render default table headers when isAdmin is false', () => {
      component.isAdmin = false;
      fixture.detectChanges();

      const headers = queryAll(fixture.debugElement, 'th');
      expect(headers.length).toBe(component.DEFAULT_TABLE_HEADERS.length + 1);
    });

    it('should render member rows', () => {
      const rows = queryAll(fixture.debugElement, 'tbody tr');
      expect(rows.length).toBe(3);
    });

    it('should display safe mode notice when isSafeMode is true', () => {
      component.isSafeMode = true;
      fixture.detectChanges();

      expect(query(fixture.debugElement, 'lcc-safe-mode-notice')).toBeTruthy();
    });

    it('should not display safe mode notice when isSafeMode is false', () => {
      component.isSafeMode = false;
      fixture.detectChanges();

      expect(query(fixture.debugElement, 'lcc-safe-mode-notice')).toBeFalsy();
    });

    it('should display correct member data for general public', () => {
      component.isAdmin = false;
      fixture.detectChanges();

      const firstRow = query(fixture.debugElement, 'tbody tr');
      const cells = queryAll(firstRow, 'td');

      const cellsContent: string[] = cells.map(cell =>
        cell.nativeElement.textContent.trim(),
      );

      expect(cellsContent).toEqual([
        '1',
        `${MOCK_MEMBERS[0].firstName} ${MOCK_MEMBERS[0].lastName}`,
        `${MOCK_MEMBERS[0].rating}`,
        `${MOCK_MEMBERS[0].peakRating}`,
        MOCK_MEMBERS[0].city,
        MOCK_MEMBERS[0].chessComUsername,
        MOCK_MEMBERS[0].lichessUsername,
      ]);
    });

    it('should display correct member data for admins when safe mode is disabled', () => {
      component.isAdmin = true;
      component.isSafeMode = false;
      fixture.detectChanges();

      const firstRow = query(fixture.debugElement, 'tbody tr');
      const cells = queryAll(firstRow, 'td');
      const cellsContent: string[] = cells.map(cell =>
        cell.nativeElement.textContent.trim(),
      );

      expect(cellsContent).toEqual([
        '1',
        MOCK_MEMBERS[0].firstName,
        MOCK_MEMBERS[0].lastName,
        `${MOCK_MEMBERS[0].rating}`,
        `${MOCK_MEMBERS[0].peakRating}`,
        MOCK_MEMBERS[0].city,
        MOCK_MEMBERS[0].chessComUsername,
        MOCK_MEMBERS[0].lichessUsername,
        formatDate(MOCK_MEMBERS[0].modificationInfo.dateLastEdited, 'short no-time'),
        MOCK_MEMBERS[0].yearOfBirth,
        MOCK_MEMBERS[0].email,
        MOCK_MEMBERS[0].phoneNumber,
        formatDate(MOCK_MEMBERS[0].dateJoined, 'short no-time'),
      ]);
    });

    it('should display correct member data for admins when safe mode is enabled', () => {
      component.isAdmin = true;
      component.isSafeMode = true;
      fixture.detectChanges();

      const firstRow = query(fixture.debugElement, 'tbody tr');
      const cells = queryAll(firstRow, 'td');
      const cellsContent: string[] = cells.map(cell =>
        cell.nativeElement.textContent.trim(),
      );

      expect(cellsContent).toEqual([
        '1',
        `${MOCK_MEMBERS[0].firstName} ${MOCK_MEMBERS[0].lastName}`,
        `${MOCK_MEMBERS[0].rating}`,
        `${MOCK_MEMBERS[0].peakRating}`,
        MOCK_MEMBERS[0].city,
        MOCK_MEMBERS[0].chessComUsername,
        MOCK_MEMBERS[0].lichessUsername,
      ]);
    });
  });
});
