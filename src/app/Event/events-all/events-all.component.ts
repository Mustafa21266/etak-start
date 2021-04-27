import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../../etakstart.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-events-all',
  templateUrl: './events-all.component.html',
  styleUrls: ['./events-all.component.css']
})
export class EventsAllComponent implements OnInit {
  events = [];
  originalEvents = [];
  isMobileLayout = false;
  date;
  constructor(private communityService: CommunityService) { }
  searchResultsChange(results){
    this.events = results
  }
  ngOnInit(): void {
    this.communityService.getAllEvents().subscribe(data => {
      data.forEach(element => {
        let now = DateTime.now();
      let newDate = DateTime.fromISO(element.fields.date_added);
      this.date = now.toLocaleString()
      // Make a fuzzy time
        var delta = Math.round((now- newDate) / 1000);
        var minute = 60,
                  hour = minute * 60,
                    day = hour * 24,
                week = day * 7;
        var fuzzy;
        if (delta < 30) {
            fuzzy = 'just now.';
            element.fields.date_added = fuzzy;
          } else if (delta < minute) {
           fuzzy = delta + ' seconds ago.';
           element.fields.date_added = fuzzy;
          } else if (delta < 2 * minute) {
              fuzzy = 'a minute ago.'
              element.fields.date_added = fuzzy;
           } else if (delta < hour) {
              fuzzy = Math.floor(delta / minute) + ' minutes ago.';
              element.fields.date_added = fuzzy;
          } else if (Math.floor(delta / hour) == 1) {
         fuzzy = '1 hour ago.'
         element.fields.date_added = fuzzy;
          } else if (delta < day) {
           fuzzy = Math.floor(delta / hour) + ' hours ago.';
           element.fields.date_added = fuzzy;
          } else if (delta < day * 2) {
           fuzzy = 'yesterday';
           element.fields.date_added = fuzzy;
          }else {
            element.fields.date_added = element.fields.date_added.slice(0 ,10);
          }
      });

      this.events = data;
      this.originalEvents = this.events
    })
    this.isMobileLayout = window.innerWidth <= 991
    window.onresize = () => {this.isMobileLayout = window.innerWidth <= 991};
    

  }
  filterByCheckBox(event){
    if(event.target.value === 'ascending'){
      if(event.target.classList.contains("checked")){

      }else {
        event.target.classList.add("checked")
        document.getElementById("descending").classList.remove("checked")
        this.events.reverse()
      }
      document.getElementById("descending").removeAttribute("checked")

    }else{
      document.getElementById("ascending").removeAttribute("checked")
      if(event.target.classList.contains("checked")){

      }else {
        event.target.classList.add("checked")
        document.getElementById("ascending").classList.remove("checked")
        this.events.reverse()
      }
      
    }
  }
  filterBySideBar(event){
      if(event.target.id === 'ascendingSideBar'){
        if(event.target.parentElement.classList.contains('selected')){
        }else {
          event.target.innerHTML = "<strong>Ascending</strong>";
          document.getElementById("descendingSideBar").innerHTML = 'Descending';
          event.target.classList.add('selected')
          document.getElementById("descendingSideBar").classList.remove('selected')
          this.events.reverse();
        }
        
      }else{
        if(event.target.parentElement.classList.contains('selected')){
        }else {
          event.target.innerHTML = "<strong>Descending</strong>";
        document.getElementById("ascendingSideBar").innerHTML = 'Ascending';
        event.target.classList.add('selected')
        document.getElementById("ascendingSideBar").classList.remove('selected')
        // document.getElementById("ascendingSideBar").children[0].classList.remove('selected')
        this.events.reverse();
        }
      }
  }
   // document.getElementsByClassName("remove")[0].addEventListener("mouseover",transformX);
   transformX(event){
    // event.target.style.width = "200%";
    event.target.style.transform = "scale(1.5)";
    
  }
  transformY(event){
    event.target.style.transform = "scale(1)";
    
  }
  /* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
openNav() {
  if(window.innerWidth > 700){
    document.getElementById("searchSidebar").style.width = '350px';
  }else {
    document.getElementById("searchSidebar").style.width = '45%';
  }
  // document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
closeNav() {
  document.getElementById("searchSidebar").style.width = '0px';
  // document.getElementById("main").style.marginLeft = "0";
}
}
