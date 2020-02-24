import { Component, OnInit } from '@angular/core';
import { MapService } from 'src/app/services/map.service';
import { Location } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  maps: any;
  baseUrl: string;
  numOfMaps: number;

  constructor(private mapService: MapService, private location: Location) { }

  ngOnInit() {

    this.baseUrl = window.location.origin.split(":")[0] + ':' + window.location.origin.split(":")[1];

    this.mapService.getAllMaps().subscribe(maps => {
      this.maps = maps["maps"];
      console.log(this.maps)
      this.numOfMaps = this.maps.length;
    });
  }

  showDeleteConfirmationModal(mapId: number): void {
    $('.ui.basic.deleteConfirmation.modal').modal({
      onApprove: () => {
        $(".ui.dimmer").addClass("active");

        this.mapService.deleteMap(mapId).subscribe(res => {
          if(res) {
            $(".ui.dimmer").removeClass("active");
            $("#" + mapId).remove();

            this.numOfMaps -= 1;
          }
        })
      }
    }).modal("show");
  }

  showComingSoonModal(): void {
    $('.ui.basic.comingSoon.modal').modal("show");
  }

}
