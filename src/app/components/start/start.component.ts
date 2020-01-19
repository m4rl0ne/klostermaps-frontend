import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router"

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  model: any = { }

  constructor(private router: Router) { }

  ngOnInit() {
  }

  startNavigation(): void {
    // console.log(JSON.stringify(this.model))
    // send model.start and model.destination to the backend

    

    // navigate to navigation
    this.router.navigate(['/navigation/' + this.model.start + '/' + this.model.destination])
  }

}
