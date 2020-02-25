import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './components/main/start/start.component'
import { NavigationComponent } from './components/main/navigation/navigation.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminOverviewComponent } from './components/admin/admin-overview/admin-overview.component';
import { EventComponent } from './components/admin/event/event.component';
import { EventCreateOrUpdateComponent } from './components/admin/event/event-create-or-update/event-create-or-update.component';
import { MapComponent } from './components/admin/map/map.component';
import { MapCreateOrUpdateComponent } from './components/admin/map/map-create-or-update/map-create-or-update.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { MainComponent } from './components/main/main.component';

const routes: Routes = [

  { path: '', component: MainComponent },

  { path: 'admin', component: AdminComponent, canActivate: [AuthGuardService], children: [

    { path: '', pathMatch: 'full', redirectTo: 'overview' },

    { path: 'overview', component: AdminOverviewComponent },

    { path: 'map', component: MapComponent },

    { path: 'map/createOrEdit', component: MapCreateOrUpdateComponent },

    { path: 'event', component: EventComponent },

    { path: 'event/createOrEdit', component: EventCreateOrUpdateComponent }
  ]},

  { path: 'admin/login', component: AdminLoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }