import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownRendererComponent } from './markdown-renderer.component';

describe('MarkdownRendererComponent', () => {
  let fixture: ComponentFixture<MarkdownRendererComponent>;
  let component: MarkdownRendererComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MarkdownRendererComponent],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MarkdownRendererComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  });
});
