import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';

declare var $: any;
declare var L: any;

@Component({
  selector: 'app-map-detail-modal',
  templateUrl: './map-detail-modal.component.html',
  styleUrls: ['./map-detail-modal.component.scss']
})
export class MapDetailModalComponent implements OnInit {

  @Input('mode') mode: any;
  @Input('title') title: any;
  @Input('header') header: any;
  @Input('maps') maps: any;
  @Input('mapToCreate') mapToCreateName: any;
  @Input('origin') origin: any;

  @Output() closed = new EventEmitter<any>();

  /**
   * Leaflet map
   */
  leafletMap: any;
  mapInit: boolean = false;
  currentOverlay: any;

  selectedMarkerArray = [];

  constructor(private baseService: BaseService) { }

  ngOnInit() {
    this.maps = this.maps.maps;

    let that = this;
    $(".ui.mapDetailModal").modal({
      onHide: () => {
        if(!that.selectedMarkerArray ||that.selectedMarkerArray.length == 0) {
          that.closed.emit(true);
        }
      },

      onApprove: () => {
        that.closed.emit(that.selectedMarkerArray);
      }
    }).modal("show");

    $(".search.selection.dropdown").dropdown({
      onChange: (mapFileName) => {
        if(!this.mapInit) {
          this.mapInit = true;

          this.leafletMap = L.map('detailMap', {
            crs: L.CRS.Simple,
            minZoom: -2,
            maxZoom: 1
          });
        }

        if(this.currentOverlay) {
          this.leafletMap.removeLayer(this.currentOverlay);
        }

        let dimensions;
        this.maps.forEach((map: { mapFileName: any; dimensions: any; }, mapIndex: any) => {
          if(map.mapFileName == mapFileName) dimensions = map.dimensions;
        });
                
        var bounds = [[0,0], [dimensions.height,dimensions.width]];
        L.imageOverlay(this.baseService.baseUrl + '/maps/' + mapFileName, bounds).addTo(this.leafletMap);
        this.leafletMap.fitBounds(bounds);

        let blueIcon = new L.Icon({
          iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        let greenIcon = new L.Icon({
          iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        //add all markers
        let map = this.maps.find(x => x.mapFileName == mapFileName);
        let markerArray = [];
        
        for(let marker of map.markers) {
          if(marker.roomType != "stairway") continue;

          let lMarker = new L.marker([marker.position.lat,marker.position.lng]);
          lMarker.id = marker.id;

          if(that.selectedMarkerArray.filter(m => m.target.id == lMarker.id).length > 0) {
            lMarker.setIcon(greenIcon);
          }else {
            lMarker.setIcon(blueIcon);
          }

          lMarker.on("click", (e) => {  

            console.log("Marker Array:");
            console.log(markerArray);

            if(that.selectedMarkerArray.length == 2) {
              that.selectedMarkerArray.shift();
            }

            that.selectedMarkerArray.push({
              origin: that.origin,
              target: lMarker,
              targetMapId: map._id
            });

            console.log("Selected Marker Array: ");
            console.log(that.selectedMarkerArray);

            lMarker.setIcon(greenIcon);
          });

          markerArray.push(lMarker);
        }

        this.currentOverlay = L.featureGroup(markerArray).addTo(this.leafletMap);        
      }
    });
  }

  ngOnDestroy() {
    setTimeout(() => { $(".dimmer.modals").remove(); }, 350);    
  }
}
