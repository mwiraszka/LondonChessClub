import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AuthModule } from '@app/core/auth';
import { FooterModule } from '@app/core/footer';
import { HeaderModule } from '@app/core/header';
import { NavModule } from '@app/core/nav';

const modules = [AuthModule, FooterModule, HeaderModule, NavModule];

@NgModule({
  imports: [CommonModule, modules],
  exports: [modules],
})
export class CoreModule {}
