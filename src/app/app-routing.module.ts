import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './components/start/start.component'
import { NavigationComponent } from './components/navigation/navigation.component';

const routes: Routes = [
  { path: 'start', component: StartComponent },
  { path: 'navigation/:start/:destination', component: NavigationComponent },
  { path: '', redirectTo: 'start', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }