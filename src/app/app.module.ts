import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { StartComponent } from './components/start/start.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminComponent } from './components/admin/admin.component';
import { AdminOverviewComponent } from './components/admin/admin-overview/admin-overview.component';
import { EventComponent } from './components/admin/event/event.component';
import { EventCreateOrUpdateComponent } from './components/admin/event/event-create-or-update/event-create-or-update.component';
import { MapComponent } from './components/admin/map/map.component';
import { MapCreateOrUpdateComponent } from './components/admin/map/map-create-or-update/map-create-or-update.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AuthGuardService } from './guards/auth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    NavigationComponent,
    AdminComponent,
    AdminOverviewComponent,
    EventComponent,
    EventCreateOrUpdateComponent,
    MapComponent,
    MapCreateOrUpdateComponent,
    AdminLoginComponent
  ],
  imports: [
    SuiModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
