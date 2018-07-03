import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RatematchComponent } from './ratematch/ratematch.component';
const routes: Routes = [
  { path: "**", component: RatematchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
