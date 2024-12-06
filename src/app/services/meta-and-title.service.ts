import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class MetaAndTitleService {
  constructor(
    private meta: Meta,
    private title: Title,
  ) {}

  updateTitle(title: string): void {
    this.title.setTitle(title);
  }

  updateDescription(desc: string): void {
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.meta.updateTag({ name: 'description', content: desc });
  }
}
