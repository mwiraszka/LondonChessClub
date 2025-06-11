import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { ADMIN_CONTROLS_CONFIG } from '@app/directives/admin-controls.directive';
import type { AdminControlsConfig } from '@app/models';
import { query } from '@app/utils';

import { AdminControlsComponent } from './admin-controls.component';

describe('AdminControlsComponent', () => {
  let fixture: ComponentFixture<AdminControlsComponent>;
  let component: AdminControlsComponent;

  const mockAdminControlsConfig: AdminControlsConfig = {
    buttonSize: 15,
    deleteCb: () => 'mock delete callback',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminControlsComponent, RouterModule.forRoot([])],
      providers: [
        {
          provide: ADMIN_CONTROLS_CONFIG,
          useValue: mockAdminControlsConfig,
        },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AdminControlsComponent);
        component = fixture.componentInstance;
      });
  });

  describe('bookmark button', () => {
    it('should NOT render if only bookmark callback provided', () => {
      component.config.bookmarkCb = () => 'mock bookmark callback';
      component.config.bookmarked = undefined;
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.bookmark-button')).toBeNull();
    });

    it('should NOT render if only bookmarked flag provided', () => {
      component.config.bookmarkCb = undefined;
      component.config.bookmarked = false;
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.bookmark-button')).toBeNull();
    });

    it('should only render if both bookmark callback and bookmarked flag are provided', () => {
      component.config.bookmarkCb = () => 'mock bookmark callback';
      component.config.bookmarked = false;
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.bookmark-button')).not.toBeNull();
    });

    it('should invoke bookmark callback function when clicked', () => {
      component.config.bookmarkCb = () => 'mock bookmark callback';
      fixture.detectChanges();
      const bookmarkCbSpy = jest.spyOn(component.config, 'bookmarkCb');

      query(fixture.debugElement, '.bookmark-button').triggerEventHandler('click');

      expect(bookmarkCbSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('edit button', () => {
    it('should NOT be rendered if no edit path provided', () => {
      expect(query(fixture.debugElement, '.edit-button')).toBeNull();
    });

    it('should be rendered if edit path provided', () => {
      component.config.editPath = ['event', 'edit'];
      fixture.detectChanges();

      expect(query(fixture.debugElement, '.edit-button')).not.toBeNull();
    });
  });

  describe('delete button', () => {
    describe('enabled', () => {
      it('should render', () => {
        component.config.isDeleteDisabled = false;
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.delete-button')).not.toBeNull();
      });

      it('should invoke delete callback function when clicked', () => {
        component.config.isDeleteDisabled = false;
        fixture.detectChanges();

        const deleteCbSpy = jest.spyOn(component.config, 'deleteCb');

        query(fixture.debugElement, '.delete-button').triggerEventHandler('click');

        expect(deleteCbSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('disabled', () => {
      it('should render', () => {
        component.config.isDeleteDisabled = true;
        fixture.detectChanges();

        expect(query(fixture.debugElement, '.delete-button')).not.toBeNull();
      });

      it('should NOT invoke delete callback function when clicked', () => {
        component.config.isDeleteDisabled = true;
        fixture.detectChanges();

        const deleteCbSpy = jest.spyOn(component.config, 'deleteCb');

        query(fixture.debugElement, '.delete-button').triggerEventHandler('click');

        expect(deleteCbSpy).not.toHaveBeenCalled();
      });
    });
  });
});
