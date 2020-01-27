import { Component, OnInit } from '@angular/core';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  maps: any;

  constructor(private mapService: MapService) { }

  ngOnInit() {

    this.mapService.getAllMaps().subscribe(maps => {
      this.maps = maps.maps;
      console.log(this.maps);
    })
  }

}
