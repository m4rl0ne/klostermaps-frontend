import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from './navigation/navigation.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  navigate: boolean = false;
  
  directions: any;

  constructor() { }

  ngOnInit() {
  }

  startNavigation($event) {
    this.directions = $event;
    this.navigate = true;
  }

}
