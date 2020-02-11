import { Component, OnInit } from '@angular/core';
import { MapService } from 'src/app/services/map.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  maps: any;
  baseUrl: string;

  constructor(private mapService: MapService, private location: Location) { }

  ngOnInit() {

    this.baseUrl = window.location.origin.split(":")[0] + ':' + window.location.origin.split(":")[1];

    this.mapService.getAllMaps().subscribe(maps => {
      this.maps = maps["maps"];
      // console.log(this.maps);
    })
  }

}
