import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import type { AdminControlsConfig } from '@app/types';

import { AdminControlsComponent } from './admin-controls.component';
import { ADMIN_CONTROLS_CONFIG } from './admin-controls.directive';

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
    it('should not render if only bookmark callback provided', () => {
      component.config.bookmarkCb = () => 'mock bookmark callback';
      component.config.bookmarked = undefined;
      fixture.detectChanges();

      expect(getDebugElement('.bookmark-button')).toBeNull();
    });

    it('should not render if only bookmarked flag provided', () => {
      component.config.bookmarkCb = undefined;
      component.config.bookmarked = false;
      fixture.detectChanges();

      expect(getDebugElement('.bookmark-button')).toBeNull();
    });

    it('should only render if both bookmark callback and bookmarked flag are provided', () => {
      component.config.bookmarkCb = () => 'mock bookmark callback';
      component.config.bookmarked = false;
      fixture.detectChanges();

      expect(getDebugElement('.bookmark-button')).not.toBeNull();
    });

    it('should invoke bookmark callback function when clicked', () => {
      component.config.bookmarkCb = () => 'mock bookmark callback';
      fixture.detectChanges();
      const bookmarkCbSpy = jest.spyOn(component.config, 'bookmarkCb');
      const bookmarkButton = getDebugElement('.bookmark-button');

      bookmarkButton?.triggerEventHandler('click');

      expect(bookmarkCbSpy).toHaveBeenCalledTimes(1);
      expect(bookmarkCbSpy).toHaveBeenCalledWith();
    });
  });

  describe('edit button', () => {
    it('should not be rendered if no edit path provided', () => {
      expect(getDebugElement('.edit-button')).toBeNull();
    });

    it('should be rendered if edit path provided', () => {
      component.config.editPath = ['event', 'edit'];
      fixture.detectChanges();

      expect(getDebugElement('.edit-button')).not.toBeNull();
    });
  });

  describe('delete button', () => {
    it('should render', () => {
      expect(getDebugElement('.delete-button')).not.toBeNull();
    });

    it('should invoke delete callback function when clicked', () => {
      const deleteCbSpy = jest.spyOn(component.config, 'deleteCb');
      const deleteButton = getDebugElement('.delete-button');

      deleteButton?.triggerEventHandler('click');

      expect(deleteCbSpy).toHaveBeenCalledTimes(1);
      expect(deleteCbSpy).toHaveBeenCalledWith();
    });
  });

  function getDebugElement(selector: string): DebugElement | null {
    return fixture.debugElement.query(By.css(selector));
  }
});
