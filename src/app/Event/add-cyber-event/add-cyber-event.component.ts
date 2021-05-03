import { Component, OnInit, Input, OnChanges, ElementRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityService } from '../../etakstart.service';

import {FormControl, Validators} from '@angular/forms';
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
  selector: 'app-add-cyber-event',
  templateUrl: './add-cyber-event.component.html',
  styleUrls: ['./add-cyber-event.component.css']
})
export class AddCyberEventComponent implements OnInit {
  cyberId: number;
  userObjAddEvent: any;
  token = this.cookieService.get('etak-start-token') || '';
  Cyber = [];
  spinner = 0;
  cookieValue = 'UNKNOWN';
  hide = true;
  enableRegister = false;
  stopLoop = true;
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
  selectedPlatforms = [];
  formData = new FormData();
  selectedCover: File= null;
  localUrl: string;
  cyberEvent = [];
  map;
  marker;
  apiLink = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=';
  attrs = '&inputtype=textquery&fields=name,geometry&key='+process.env['GOOGLE_MAPS_API_KEY'];
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
  constructor(private http: HttpClient,private elRef:ElementRef,private communityService: CommunityService,private route: ActivatedRoute,private router: Router,private cookieService: CookieService,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if(!this.token ){
      this.router.navigate(['homepage']);
    } else {
      setTimeout(()=>{
        this.userObjAddEvent = this.communityService.getUserObj()
        if(this.userObjAddEvent.is_cyber_owner === '0'){
          this.router.navigate(['homepage']);
        }
      },500)
      this.cyberId = parseInt(this.router.url.replace("/add-cyber-event/",""))
      this.localUrl = 'https://etak-start.s3.eu-west-3.amazonaws.com/media/default_cover.png';
     this.getCyberDetails();
    this.googleMapsApi()
    }
    

}
async googleMapsApi(data = {}){
    const options: LoaderOptions = {
      region: 'EG',
      language:'ar'
      /* todo */
    };
    const loader = new Loader('AIzaSyD--3IwVc2MTQWjd6i6tBC2RQrYeOBP8s0', options);
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
    // let governate = (document.getElementById("governateList")) as HTMLSelectElement
      this.http.post(this.apiLink+location.value+','+this.governate+this.attrs,headers).subscribe(data=>{
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
    const loader = new Loader('AIzaSyD--3IwVc2MTQWjd6i6tBC2RQrYeOBP8s0', options);
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
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  async getCyberDetails(){
    await this.communityService.getCyberDetails(this.cyberId).subscribe(data => this.Cyber = data);
  }
  cardMouseEnter(event){
    event.target.style.filter = 'brightness(1.5)';
    event.target.style.border = '5px solid blue';
    
  }
  cardMouseLeave(event){
    event.target.style.filter = 'brightness(1)';
    event.target.style.border = '0px';
  }
  openCoverInput(event){
    document.getElementById("addEventCover").click();
  }
  selectEventCover(event){
    this.selectedCover = event.target.files[0];
    var reader = new FileReader();
    document.getElementById("output").setAttribute("src", URL.createObjectURL(event.target.files[0]));
    reader.readAsDataURL(event.target.files[0]);
    document.getElementById("output").style.border = "0px";
    URL.createObjectURL(event.target.files[0]);
  }
  loadFile = function(event) {
    var output = document.getElementById('output');
    output.setAttribute("src",URL.createObjectURL(event.target.files[0])) 
    output.onload = function() {
      URL.revokeObjectURL(output.getAttribute("src"))
    }
  }
  async addCyberEventOnSubmit(event){
    if(this.cyberEventForm.invalid){
      if((<HTMLInputElement>document.getElementById("addEventCover")).value === ''){
        document.getElementById("output").style.border = "5px solid red";
        
      }
      this.spinner = 0;
      this.openSnackBar("Please fill all required fields","Ok");
    }else {
      if((<HTMLInputElement>document.getElementById("addEventCover")).value === ''){
        document.getElementById("output").style.border = "5px solid red";
        this.spinner = 0;
        this.openSnackBar("Please add a cover","Ok");
      }else {
        const extensions = ['jpg','jpeg','png']
        if(extensions.includes(this.selectedCover.name.split(".")[this.selectedCover.name.split(".").length-1])){
          this.spinner = 1;
      const formData = new FormData(document.querySelector('#addCyberEventForm'))
    for (var pair of formData.entries()) {
  this.cyberEventForm.value[pair[0]] = pair[1];

}
let location = (document.getElementById("location")) as HTMLInputElement
// let governate = (document.getElementById("governateList")) as HTMLSelectElement
this.cyberEventForm.value.location = `${location.value},${this.governate}`
await this.communityService.addCyberEvent(this.cyberEventForm.value,this.Cyber[0].pk,this.userObjAddEvent.pk).subscribe(event => {
  this.cyberEvent = event;
  this.formData.append('cover', this.selectedCover,this.selectedCover.name);
  this.http.post('https://etak-start-api.herokuapp.com/add-cyber-event-cover/'+this.Cyber[0].pk+'/'+this.cyberEvent[0].pk+'/'+this.userObjAddEvent.pk, this.formData)
        .subscribe(res => {
          this.openSnackBar("Event Created Successfully","Ok");
          setTimeout(()=>{
            this.router.navigate(['/event-details/'+this.cyberEvent[0].pk])
          },2000)
  },error  => {
    this.spinner = 0;
    this.openSnackBar("Something went wrong.. Sorry","Ok");
  })
});
        }
        else {
          this.spinner = 0;
          this.openSnackBar("Please select a valid extension!","Ok");
        }
        
      }
      
    }
    
}
}
