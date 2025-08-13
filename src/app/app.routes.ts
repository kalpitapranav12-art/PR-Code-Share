// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PadComponent } from './pad/pad.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'pad/:id', component: PadComponent }
];
