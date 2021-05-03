import { Component, OnInit, Input, OnChanges, ElementRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityService } from '../../etakstart.service';

import {FormBuilder, FormControl, Validators} from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {Loader, LoaderOptions} from 'google-maps';


interface data {
  candidates: Array<any>,
  geometry: Object,
  viewport:  Object,
  name: string
}
@Component({
  selector: 'app-edit-cyber-event',
  templateUrl: './edit-cyber-event.component.html',
  styleUrls: ['./edit-cyber-event.component.css']
})
export class EditCyberEventComponent implements OnInit {
  cyberEventId: number;
  userObjEditEvent: any;
  token = this.cookieService.get('etak-start-token') || '';
  Cyber = [];
  CyberEvent = [];
  cookieValue = 'UNKNOWN';
  hide = true;
  enableRegister = false;
  stopLoop = true;
  selectedPlatforms = [];
  formData = new FormData();
  selectedCover: File= null;
  localUrl: string;
  cyberEvent = [];
  changed = false;
  cyberEventForm = new FormGroup({
    name: new FormControl(''),
    location: new FormControl(''),
    from_date: new FormControl(''),
    to_date: new FormControl(''),
    from_time: new FormControl(''),
    to_time: new FormControl(''),
    eventStartSelect:  new FormControl(''),
    eventEndSelect:  new FormControl(''),
    description: new FormControl(''),
    cover: new FormControl(''),
    platform: new FormControl(''),
    price_per_player: new FormControl('0.0'),
    first_place_reward: new FormControl('0.0'),
    second_place_reward: new FormControl('0.0'),
    third_place_reward: new FormControl('0.0'),
    game: new FormControl(''),
    
  }, [Validators.required]);
  options: FormGroup;
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto');
  map;
  marker;
  apiLink = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=';
  attrs = '&inputtype=textquery&fields=name,geometry&key='+process.env.NODE_ENV['GOOGLE_MAPS_API_KEY'];
  locationObj = {};
  governates = [{value:'Alexandria',},{value:'Aswan',},{value:'Asyut',},{value:'Beheira',},{value:'Beni Suef',},{value:'Cairo',},{value:'Dakahlia',},{value:'Damietta',},{value:"Faiyum",},{value:'Gharbia',},{value:"Giza",},{value:"Ismailia",},{value:"Kafr El Sheikh",},{value:'Luxor',},{value:"Matruh",},{value:'Minya',},{value:'Monufia',},{value:"New Valley",},{value:"North Sinai",},{value:"Port Said",},{value:"Qalyubia",},{value:"Qena",},{value:"Red Sea",},{value:"Sharqia",},{value:'Sohag',},{value:"South Sinai",},{value:"Suez",}]
  days = [{value:'1',},{value:'2',},{value:'3',},{value:'4',},{value:'5',},{value:'6',},{value:'7',},{value:'8',},{value:"9",},{value:'10',},{value:"11",},{value:"12",},{value:"13",},{value:'14',},{value:"15'",},{value:'16',},{value:'17',},{value:"18",},{value:"19",},{value:"20",},{value:"21",},{value:"22",},{value:"23",},{value:"24",},{value:'25',},{value:"26",},{value:"27",},{value:"28",},{value:"29",},{value:"30",},{value:"31",},]
  months = [{value:'January',},{value:'February',},{value:'March',},{value:'April',},{value:'May',},{value:'June',},{value:'July',},{value:'August',},{value:'September',},{value:'October',},{value:'November',},{value:'December',}]
  platforms = [{value:'ps3',viewValue:'Playstation 3'},{value:'ps4',viewValue:'Playstation 4'},{value:'ps5',viewValue:'Playstation 5'},{value:'xbox_360',viewValue:'Xbox 360'},{value:'xbox_one',viewValue:'Xbox One'},{value:'xbox_series_x',viewValue:'Xbox Series X'},{value:'pc',viewValue:'PC'},{value:'vr',viewValue:'VR'}]
  startDay :number;
  startMonth :number;
  endMonth :number;
  endDay :number;
  governate : string;
  platform: string;
  spinner = 0;
  constructor(fb: FormBuilder,private http: HttpClient,private elRef:ElementRef,private communityService: CommunityService,private route: ActivatedRoute,private router: Router,private cookieService: CookieService,private _snackBar: MatSnackBar) {
    this.options = fb.group({
      hideRequired: this.hideRequiredControl,
      floatLabel: this.floatLabelControl,
    });
   }

  ngOnInit(): void {
    if(!this.token ){
      this.router.navigate(['homepage']);
    } else {
      setTimeout(()=>{
        this.userObjEditEvent = this.communityService.getUserObj()
        if(this.userObjEditEvent.is_cyber_owner === '0'){
          this.router.navigate(['homepage']);
        }
      },500)
      this.cyberEventId = parseInt(this.router.url.replace("/edit-cyber-event/",""))
      this.getCyberEventDetails();  
      this.googleMapsApi()
    }
  

}
async googleMapsApi(data = {}){
    const options: LoaderOptions = {
      region: 'EG',
      language:'ar'
      /* todo */
    };
    const loader = new Loader(process.env.NODE_ENV['GOOGLE_MAPS_API_KEY'], options);
    loader.load().then(function (google) {
      const uluru = { lat: 31.205753, lng:  29.924526 };
        const map = new google.maps.Map(document.getElementById('map'), {
            center: uluru,
            zoom: 15,
        });
        let markers  = document.getElementsByTagName("img")
        return map
    }).then((data)=>{
      this.map = data;
    });
}
async onClickFind($event){
  let  findPlace =  new Promise<any>((resolve, reject) => {
    const headers = { 
      'content-type': 'application/json',
      'Access-Control-Allow-Origin':'true'
    }; 
    let location = (document.getElementById("location")) as HTMLInputElement
    let governate = (document.getElementById("governateList")) as HTMLSelectElement
      this.http.post(this.apiLink+location.value+','+governate.options[governate.selectedIndex].text+this.attrs,headers).subscribe(data=>{
        this.locationObj = data;
    resolve(data)
    })
  })
  findPlace.then((data)=>{
    document.getElementById("map").innerHTML = '';
    const options: LoaderOptions = {
      region: 'EG',
      language:'ar'
      /* todo */
    };
    let dataObj: data;
    dataObj = data
    const loader = new Loader(process.env.NODE_ENV['GOOGLE_MAPS_API_KEY'], options);
    let lat = dataObj.candidates[0].geometry.location.lat
    let lng = dataObj.candidates[0].geometry.location.lng
    loader.load().then(function (google) {
      const uluru = { lat: lat,  lng:  lng};
        const map = new google.maps.Map(document.getElementById('map'), {
            center: uluru,
            zoom: 15,
        });
        const marker = new google.maps.Marker({
          position: uluru,
          map: map,
        });
        return map
    }).then((data)=>{
      this.map = data;
    });




  })
}
  async getCyberEventDetails(){
    await this.communityService.getCyberEventDetails(this.cyberEventId).subscribe(data => {
      this.CyberEvent = data
      this.communityService.getCyberDetails(this.CyberEvent[0].fields.cyber[0]).subscribe(data => this.Cyber = data);
      this.cyberEventForm.setValue({
        name: this.CyberEvent[0].fields.name,
        location: this.CyberEvent[0].fields.location.split(",")[0],
        from_date: this.CyberEvent[0].fields.from_date,
        to_date: this.CyberEvent[0].fields.to_date,
        from_time: this.CyberEvent[0].fields.from_time.substring(0,5),
        to_time: this.CyberEvent[0].fields.to_time.substring(0,5),
        eventStartSelect:  this.CyberEvent[0].fields.from_time.substring(6,8),
        eventEndSelect:  this.CyberEvent[0].fields.to_time.substring(6,8),
        description: this.CyberEvent[0].fields.description,
        cover: '',
        price_per_player: this.CyberEvent[0].fields.price_per_player,
        first_place_reward: this.CyberEvent[0].fields.first_place_reward,
        second_place_reward: this.CyberEvent[0].fields.second_place_reward,
        third_place_reward: this.CyberEvent[0].fields.third_place_reward,
        game: this.CyberEvent[0].fields.game,
        platform: this.CyberEvent[0].fields.platform,
      })
      this.governate = this.CyberEvent[0].fields.location.split(",")[1]
    });
  }
  cardMouseEnter(event){
    // event.target.firstChild.nextSibling.firstChild.style.visibility = "visible"
    event.target.style.filter = 'brightness(1.5)';
    event.target.style.border = '5px solid blue';
    
  }
  cardMouseLeave(event){
    // event.target.firstChild.nextSibling.firstChild.style.visibility = "hidden"
    event.target.style.filter = 'brightness(1)';
    event.target.style.border = '0px';
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  deleteEvent(event){
    this.spinner = 1;
    this.communityService.deleteCyberEvent(this.Cyber[0].pk,this.CyberEvent[0].pk,this.userObjEditEvent.pk).subscribe(event => {
      this.cyberEvent = event;
      this.openSnackBar("Event Deleted Successfully","Ok");
      setTimeout(()=>{
        this.router.navigate(['/events-all'])
      },2000)
    },error  => {
      this.openSnackBar("Something went wrong.. Sorry","Ok");
    })
  }
  openCoverInput(event){
    document.getElementById("addEventCover").click();
  }
  selectEventCover(event){
    this.selectedCover = event.target.files[0];
    this.changed = true;
    // this.localUrl = URL.createObjectURL(event.target.files[0]);
    var reader = new FileReader();
    document.getElementById("output").setAttribute("src", URL.createObjectURL(event.target.files[0]));
    reader.readAsDataURL(event.target.files[0]);
    URL.createObjectURL(event.target.files[0]);
  }
  loadFile = function(event) {
    var output = document.getElementById('output');
    output.setAttribute("src",URL.createObjectURL(event.target.files[0])) 
    output.onload = function() {
      URL.revokeObjectURL(output.getAttribute("src")) // free memory
    }
  }
  async editCyberEventOnSubmit(event){
    if(this.cyberEventForm.invalid){
        this.spinner = 0;
        this.openSnackBar("Please fill all required fields","Ok");
    }else {
          this.spinner = 1;
          const formData = new FormData(document.querySelector('#editCyberEventForm'))
          for (var pair of formData.entries()) {
        this.cyberEventForm.value[pair[0]] = pair[1];
      }
      let location = (document.getElementById("location")) as HTMLInputElement
          this.cyberEventForm.value.location = location.value+','+this.governate
      await this.communityService.editCyberEvent(this.cyberEventForm.value,this.Cyber[0].pk,this.CyberEvent[0].pk,this.userObjEditEvent.pk).subscribe(event => {
        this.cyberEvent = event;
        if(this.changed == true){
          const extensions = ['jpg','jpeg','png']
          if(extensions.includes(this.selectedCover.name.split(".")[this.selectedCover.name.split(".").length-1])){
            this.formData.append('cover', this.selectedCover,this.selectedCover.name);
        this.http.post('https://etak-start-api.herokuapp.com/add-cyber-event-cover/'+this.CyberEvent[0].fields.cyber[0]+'/'+this.CyberEvent[0].pk+'/'+this.userObjEditEvent.pk, this.formData)
              .subscribe(res => {
                this.openSnackBar("Event Editied Successfully","Ok");
                setTimeout(()=>{
                  this.router.navigate(['/event-details/'+this.cyberEvent[0].pk])
                },2000)
        },error  => {
          this.spinner = 0;
          this.openSnackBar("Something went wrong.. Sorry","Ok");
        })  
        }else {
          this.spinner = 0;
          this.openSnackBar("Please select a valid extension!","Ok");
        } 
        }else {
          this.openSnackBar("Event Editied Successfully","Ok");
                setTimeout(()=>{
                  this.router.navigate(['/event-details/'+this.cyberEvent[0].pk])
                },2000)
        }
      },error  => {
        this.spinner = 0;
        this.openSnackBar("Something went wrong.. Sorry","Ok");
      });
    }
}

}
