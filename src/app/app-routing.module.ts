import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RatematchComponent } from './ratematch/ratematch.component';
import { PreloadAllModules } from '@angular/router';
const routes: Routes = [
  { path: '', component: RatematchComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
