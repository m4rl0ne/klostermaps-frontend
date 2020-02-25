import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Router} from "@angular/router"
import { FormBuilder, Validators } from '@angular/forms';
import { StartService } from 'src/app/services/start.service';

declare var $: any;

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  @Output() gotDirections = new EventEmitter();
  startForm: any;

  constructor(private router: Router, private fb: FormBuilder, private startService: StartService) { 
    this.startForm = this.fb.group({
      start: ['Haupteingang', Validators.required],
      end: ['', Validators.required]
    });
  }

  ngOnInit() { 
  }

  startNavigation(): void {
    $(".ui.dimmer").addClass("active");
    this.startService.getDirections(this.startForm.value).subscribe(directions => {
      $(".ui.dimmer").removeClass("active");
      this.gotDirections.emit(directions);
    })
  }

}
