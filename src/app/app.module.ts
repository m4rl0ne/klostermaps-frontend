import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { StartComponent } from './components/main/start/start.component';
import { NavigationComponent } from './components/main/navigation/navigation.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminComponent } from './components/admin/admin.component';
import { AdminOverviewComponent } from './components/admin/admin-overview/admin-overview.component';
import { EventComponent } from './components/admin/event/event.component';
import { EventCreateOrUpdateComponent } from './components/admin/event/event-create-or-update/event-create-or-update.component';
import { MapComponent } from './components/admin/map/map.component';
import { MapCreateOrUpdateComponent } from './components/admin/map/map-create-or-update/map-create-or-update.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MainComponent } from './components/main/main.component';
import { MapDetailModalComponent } from './components/admin/map/map-create-or-update/map-detail-modal/map-detail-modal.component';

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
    AdminLoginComponent,
    MainComponent,
    MapDetailModalComponent
  ],
  imports: [
    SuiModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxDropzoneModule
  ],
  providers: [AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
