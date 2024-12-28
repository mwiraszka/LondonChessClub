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
    });
  });

  describe('`controlsHovered` emitter', () => {
    it('should emit `true` when component is hovered over', () => {
      const controlsHoveredSpy = jest.spyOn(component.controlsHovered, 'emit');
      fixture.debugElement.triggerEventHandler('mouseenter');

      expect(controlsHoveredSpy).toHaveBeenCalledTimes(1);
      expect(controlsHoveredSpy).toHaveBeenCalledWith(true);
    });

    it('should emit `false` when component is no longer hovered over', () => {
      const controlsHoveredSpy = jest.spyOn(component.controlsHovered, 'emit');
      fixture.debugElement.triggerEventHandler('mouseleave');

      expect(controlsHoveredSpy).toHaveBeenCalledTimes(1);
      expect(controlsHoveredSpy).toHaveBeenCalledWith(false);
    });
  });

  function getDebugElement(selector: string): DebugElement | null {
    return fixture.debugElement.query(By.css(selector));
  }
});
