import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router"
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
  keywords = [];
  error: boolean = false;

  constructor(private router: Router, private fb: FormBuilder, private startService: StartService) {
    this.startForm = this.fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.startService.getKeywords().subscribe(keys => {
      keys.forEach(key => {
        this.keywords.push({ title: key.key });
      });

      $(".ui.startSearch").search({
        source: this.keywords,
        onSelect: (e) => {
          this.startForm.patchValue({
            start: e.title
          });
        },
        templates: {
          message: (message, type) => {
            if(type == "empty") {
              return "<div class='message empty'><div class='header'>Keine Ergebnisse</div><div class='description'>Keine Suchergebnisse gefunden</div></div>";
            }else {
              return "<div class='message'>" + message + "</div>";
            }
          }
        }
      });

      $(".ui.endSearch").search({
        source: this.keywords,
        onSelect: (e) => {
          this.startForm.patchValue({
            end: e.title
          });
        },
        templates: {
          message: (message, type) => {
            if(type == "empty") {
              return "<div class='message empty'><div class='header'>Keine Ergebnisse</div><div class='description'>Keine Suchergebnisse gefunden</div></div>";
            }else {
              return "<div class='message'>" + message + "</div>";
            }
          }
        }
      });
      
    });
  }

  startNavigation(): void {
    $(".ui.dimmer").addClass("active");
    let that = this;
    this.startService.getDirections(this.startForm.value).subscribe(directions => {
      $(".ui.dimmer").removeClass("active");
      this.error = false;
      this.gotDirections.emit(directions);
    }, error => {
      $(".ui.dimmer").removeClass("active");
      this.error = true;
    })
  }

}
