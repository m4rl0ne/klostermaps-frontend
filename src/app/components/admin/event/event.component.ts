import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';

declare var $: any;

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  events: any;

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.eventService.getEvents().subscribe(events => {
      this.events = events["events"];

      let that = this;
      setTimeout(() => {
        $(".checkbox").checkbox({
          onChange: function(){
            $(".ui.dimmer").addClass("active");
            $(".checkbox").checkbox("set unchecked");
            $(".eventActive").text("Nein");

            let eventId = $(this)[0].dataset.eventid;
            that.eventService.activateEvent(eventId).subscribe(res => {
              $(".ui.dimmer").removeClass("active");
              $(".checkbox[data-eventId='" + eventId +"']").checkbox("set checked")
              $(".checkbox[data-eventId='" + eventId +"']").parent().parent().find(".eventActive").text("Ja");
            }, error => {
              console.log(error);
              $(".ui.dimmer").removeClass("active");

            });
          }
        });
      }, 100)
    });
  }

  showDeleteConfirmationModal(eventId: number): void {
    $('.ui.basic.deleteConfirmation.modal').modal({
      onApprove: () => {
        $(".ui.dimmer").addClass("active");

        this.eventService.deleteEvent(eventId).subscribe(res => {
          if(res) {
            $(".ui.dimmer").removeClass("active");
            $("#" + eventId).remove();
          }
        })
      }
    }).modal("show");
  }

  showComingSoonModal(): void {
    $('.ui.basic.comingSoon.modal').modal("show");
  }

}
