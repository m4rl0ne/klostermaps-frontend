import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';

declare var $: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  activeEvent: any;

  constructor(private router: Router, private authService: AuthService, private eventService: EventService) { }

  ngOnInit() {
    $(".dropdown").dropdown();

    this.eventService.getActiveEvent().subscribe(event => {
      this.activeEvent = event["event"][0];
    })
  }

  logout() {
    this.authService.logout();
  }

}
