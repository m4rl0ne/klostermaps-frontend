import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-map-create-or-update',
  templateUrl: './map-create-or-update.component.html',
  styleUrls: ['./map-create-or-update.component.scss']
})
export class MapCreateOrUpdateComponent implements OnInit {

  mapId: string;

  constructor() { }

  ngOnInit() {
    $(".dropdown").dropdown();
  }

}
