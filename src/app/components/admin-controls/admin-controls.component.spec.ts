import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { ADMIN_CONTROLS_CONFIG_TOKEN } from '@app/directives/admin-controls.directive';
import { KeyStateService } from '@app/services';
import { query } from '@app/utils';

import { AdminControlsComponent } from './admin-controls.component';

describe('AdminControlsComponent', () => {
  let fixture: ComponentFixture<AdminControlsComponent>;
  let component: AdminControlsComponent;
  let keyStateService: KeyStateService;

  let ctrlMetaKeyPressedSpy: jest.SpyInstance;
  let deleteCbSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminControlsComponent, RouterModule.forRoot([])],
      providers: [
        {
          provide: ADMIN_CONTROLS_CONFIG_TOKEN,
          useValue: {
            buttonSize: 15,
          },
        },
        KeyStateService,
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AdminControlsComponent);
        component = fixture.componentInstance;

        keyStateService = TestBed.inject(KeyStateService);

        ctrlMetaKeyPressedSpy = jest.spyOn(keyStateService, 'ctrlMetaKeyPressed', 'get');
        deleteCbSpy = jest.spyOn(component.config, 'deleteCb');

        fixture.detectChanges();
      });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('UI elements', () => {
    describe('bookmark button', () => {
      it('should not render if only bookmarkCb is provided', () => {
        component.config.bookmarkCb = () => 'mock bookmark callback';
        component.config.bookmarked = undefined;
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.bookmark-button')).toBeNull();
      });

      it('should not render if only bookmarked is provided', () => {
        component.config.bookmarkCb = undefined;
        component.config.bookmarked = false;
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.bookmark-button')).toBeNull();
      });

      it('should render if both bookmarkCb and bookmarked are provided', () => {
        component.config.bookmarkCb = () => 'mock bookmark callback';
        component.config.bookmarked = false;
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.bookmark-button')).not.toBeNull();
      });

      it('should invoke bookmarkCb when clicked', () => {
        component.config.bookmarkCb = () => 'mock bookmark callback';
        component.config.bookmarked = false;
        fixture.detectChanges();

        const bookmarkCbSpy = jest.spyOn(component.config, 'bookmarkCb');

        query(fixture.debugElement, '.bookmark-button').triggerEventHandler('click');

        expect(bookmarkCbSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('edit button', () => {
      it('should not render if editPath is not provided', () => {
        component.config.editPath = undefined;
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.edit-button')).toBeNull();
      });

      it('should render if editPath is provided', () => {
        component.config.editPath = ['event', 'edit'];
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.edit-button')).not.toBeNull();
      });
    });

    describe('delete button', () => {
      describe('on touch devices', () => {
        beforeEach(() => {
          component.isTouchDevice = true;
          fixture.detectChanges();

          component.ngOnInit();
        });

        describe('when isDeleteDisabled is true', () => {
          beforeEach(() => {
            component.config.isDeleteDisabled = true;
            fixture.detectChanges();
          });

          it('should render disabled', () => {
            expect(
              query(fixture.debugElement, '.delete-button').nativeElement.disabled,
            ).toBe(true);
          });

          it('should not invoke deleteCb when clicked', () => {
            query(fixture.debugElement, '.delete-button').triggerEventHandler('click');

            expect(deleteCbSpy).toHaveBeenCalledTimes(1);
          });
        });

        describe('when isDeleteDisabled is false', () => {
          beforeEach(() => {
            component.config.isDeleteDisabled = false;
            fixture.detectChanges();
          });

          it('should render enabled', () => {
            expect(
              query(fixture.debugElement, '.delete-button').nativeElement.disabled,
            ).toBe(false);
          });

          it('should invoke deleteCb when clicked', () => {
            query(fixture.debugElement, '.delete-button').triggerEventHandler('click');

            expect(deleteCbSpy).toHaveBeenCalledTimes(1);
          });
        });
      });

      describe('on non-touch devices', () => {
        beforeEach(() => {
          component.isTouchDevice = false;
          fixture.detectChanges();

          component.ngOnInit();
        });

        describe('when isDeleteDisabled is true', () => {
          beforeEach(() => {
            component.config.isDeleteDisabled = true;
            fixture.detectChanges();
          });

          it('should render disabled if ctrlMeta button is pressed', () => {
            ctrlMetaKeyPressedSpy.mockReturnValue(true);
            fixture.detectChanges();

            expect(
              query(fixture.debugElement, '.delete-button').nativeElement.disabled,
            ).toBe(true);
          });

          it('should not render if ctrlMeta button is not pressed', () => {
            ctrlMetaKeyPressedSpy.mockResolvedValue(false);
            fixture.detectChanges();

            expect(query(fixture.debugElement, '.delete-button')).toBeNull();
          });

          it('should not invoke deleteCb when clicked', () => {
            query(fixture.debugElement, '.delete-button').triggerEventHandler('click');

            expect(deleteCbSpy).toHaveBeenCalledTimes(1);
          });
        });

        describe('when isDeleteDisabled is false', () => {
          beforeEach(() => {
            component.config.isDeleteDisabled = false;
            fixture.detectChanges();
          });

          it('should render enabled if ctrlMeta button is pressed', () => {
            ctrlMetaKeyPressedSpy.mockResolvedValue(true);
            fixture.detectChanges();

            expect(
              query(fixture.debugElement, '.delete-button').nativeElement.disabled,
            ).toBe(false);
          });

          it('should not render if ctrlMeta button is not pressed', () => {
            ctrlMetaKeyPressedSpy.mockResolvedValue(false);
            fixture.detectChanges();

            expect(query(fixture.debugElement, '.delete-button')).toBeNull();
          });

          it('should invoke deleteCb when clicked', () => {
            query(fixture.debugElement, '.delete-button').triggerEventHandler('click');

            expect(deleteCbSpy).toHaveBeenCalledTimes(1);
          });
        });
      });
    });
  });
});
