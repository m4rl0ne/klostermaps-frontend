import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Router} from "@angular/router"
import { FormBuilder, Validators, AbstractControl, ValidatorFn, FormControl } from '@angular/forms';
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

  keywords = [
    { title: '205'},
    { title: '311'},
    { title: 'Biologie'},
    { title: 'Aula'},
    { title: 'Innenhof'},
  ];

  constructor(private router: Router, private fb: FormBuilder, private startService: StartService) { 
    this.startForm = this.fb.group({
      start: ['Aula', Validators.required],
      end: ['', Validators.required]
    });
  }

  ngOnInit() {
    $(".ui.search").search({
      source: this.keywords,
      onSelect: (e) => {
        this.startForm.patchValue({
          end: e.title
        });
      }
    });
  }

  startNavigation(): void {
    $(".ui.dimmer").addClass("active");
    this.startService.getDirections(this.startForm.value).subscribe(directions => {
      $(".ui.dimmer").removeClass("active");
      this.gotDirections.emit(directions);
    })
  }

}
