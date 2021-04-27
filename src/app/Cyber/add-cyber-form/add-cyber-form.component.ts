import { Component, OnInit, Input, OnChanges, ElementRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityService } from '../../etakstart.service';

import {FormControl, Validators} from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { User } from '../../models/users_model';
import { CookieService } from 'ngx-cookie-service';

import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ImageUploadComponent } from '../../image-upload/image-upload.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Loader, LoaderOptions} from 'google-maps';

interface Platform {
  value: string;
  viewValue: string;
}
interface SelectedPlatform {
  platform: string;
  pricePerHour: string;
}

interface data {
  candidates: Array<any>,
  geometry: Object,
  viewport:  Object,
  name: string
}

@Component({
  selector: 'app-add-cyber-form',
  templateUrl: './add-cyber-form.component.html',
  styleUrls: ['./add-cyber-form.component.css'],
})
// 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=ء&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyD--3IwVc2MTQWjd6i6tBC2RQrYeOBP8s0';



export class AddCyberFormComponent implements OnInit {
  
  platforms: Platform[] = [
    {value: 'ps3', viewValue: 'Playstation 3'},
    {value: 'ps4', viewValue: 'Playstation 4'},
    {value: 'ps5', viewValue: 'Playstation 5'},
    {value: 'xbox_360', viewValue: 'Xbox 360'},
    {value: 'xbox_one', viewValue: 'Xbox One'},
    {value: 'xbox_series_x', viewValue: 'Xbox Series X'},
    {value: 'pc', viewValue: 'PC'},
    {value: 'vr', viewValue: 'VR'},
  ];
  userObjAddCyber: any;
  previousPlatfrom: string;  
  cyberId: number;
  token = this.cookieService.get('etak-start-token') || '';
  Cyber = [];
  createdCyber = [];
  spinner = 0;
  loadingText = "Loading";
  cookieValue = 'UNKNOWN';
  hide = true;
  enableRegister = false;
  stopLoop = true;
  cyberForm = new FormGroup({
    token: new FormControl(''),
    name: new FormControl(''),
    location: new FormControl(''),
    governate: new FormControl(''),
    description: new FormControl(''),
    starting_working_day: new FormControl(''),
    ending_working_day: new FormControl(''),
    starting_working_hour: new FormControl(''),
    ending_working_hour: new FormControl(''),
    logo: new FormControl(''),
    cover: new FormControl(''),
    opensAtSelect : new FormControl(''),
    closesAtSelect : new FormControl(''),
    price_per_hour_ps3: new FormControl('0.0'),
    price_per_hour_ps4: new FormControl('0.0'),
    price_per_hour_ps5: new FormControl('0.0'),
    price_per_hour_xbox_360: new FormControl('0.0'),
    price_per_hour_xbox_one: new FormControl('0.0'),
    price_per_hour_xbox_series_x: new FormControl('0.0'),
    price_per_hour_pc: new FormControl('0.0'),
    price_per_hour_vr: new FormControl('0.0'),
  }, [Validators.required]);
  selectedPlatforms = [];
  formData = new FormData();
  selectedLogo: File= null;
  selectedCover: File= null;
  map;
  marker;
  apiLink = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=';
  attrs = '&inputtype=textquery&fields=name,geometry&key=AIzaSyD--3IwVc2MTQWjd6i6tBC2RQrYeOBP8s0';
  locationObj = {};
  governates = [{value:'Alexandria',},{value:'Aswan',},{value:'Asyut',},{value:'Beheira',},{value:'Beni Suef',},{value:'Cairo',},{value:'Dakahlia',},{value:'Damietta',},{value:"Faiyum",},{value:'Gharbia',},{value:"Giza",},{value:"Ismailia",},{value:"Kafr El Sheikh",},{value:'Luxor',},{value:"Matruh",},{value:'Minya',},{value:'Monufia',},{value:"New Valley",},{value:"North Sinai",},{value:"Port Said",},{value:"Qalyubia",},{value:"Qena",},{value:"Red Sea",},{value:"Sharqia",},{value:'Sohag',},{value:"South Sinai",},{value:"Suez",}]
  days = [{value:'Saturday',},{value:'Sunday',},{value:'Monday',},{value:'Tuesday',},{value:'Wednesday',},{value:'Thursday',},{value:'Friday',}]
  governate : string;
  startingWorkingDay: string;
  endingWorkingDay: string;
  opensAtSelect :number;
  closesAtSelect :number;
  constructor(private http: HttpClient,public dialog: MatDialog,private elRef:ElementRef,private communityService: CommunityService,private route: ActivatedRoute,private router: Router,private cookieService: CookieService,private _snackBar: MatSnackBar) {
    
  }
  ngOnInit(): void {
    if(!this.token ){
      this.router.navigate(['homepage']);
    } else {
      setTimeout(()=>{
        this.userObjAddCyber = this.communityService.getUserObj()
        if(this.userObjAddCyber.fields.is_cyber_owner === '0'){
          this.router.navigate(['homepage']);
        }else {
          this.googleMapsApi()
 
        }
      },500)
    }
  }
  onClickThatsIt(event){
    document.getElementById("findBtn").style.display = 'none';
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
  onChangeMap(event){
    this.map.getClickableIcons()
    let uluru = { lat: 31.205753, lng:  29.924526 };
    const marker = new google.maps.Marker({
      position: uluru,
      map: this.map,
    });
  }
  async onClickFind($event){
    let  findPlace =  new Promise<any>((resolve, reject) => {
      const headers = { 
        'content-type': 'application/json',
        'Access-Control-Allow-Origin':'true'
      }; 
      let location = (document.getElementById("location")) as HTMLInputElement
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
  createSelectedPlatform(){
let platformList = (document.getElementById("platformsList"))  as HTMLSelectElement;
let platfromListDiv = document.getElementById("platfromListDiv");
let createCyberBtn = document.getElementById("createCyberBtn");
if(this.previousPlatfrom !== platformList.options[platformList.selectedIndex].text){
  let newDivOne = document.createElement("div");
newDivOne.className = "form-row";
let newDivTwo = document.createElement("div");
newDivTwo.className = "form-group col-4";
let newDivThree = document.createElement("div");
newDivThree.className = "form-group col-8";
let newDivFour = document.createElement("div");
newDivFour.className = "remove-platform-btn";
let removePlatformItemBtn = document.createElement("button");
removePlatformItemBtn.setAttribute("type","button");
removePlatformItemBtn.innerHTML = "&#10006;";
removePlatformItemBtn.style.backgroundColor = "transparent";
removePlatformItemBtn.style.fontSize = "1.8rem";
removePlatformItemBtn.style.textAlign = "center";
removePlatformItemBtn.style.color = "red";
removePlatformItemBtn.style.border = "0px";
removePlatformItemBtn.style.transitionTimingFunction= "linear";
removePlatformItemBtn.style.transition= "width 2s";
removePlatformItemBtn.style.float= "right";
removePlatformItemBtn.setAttribute("onmouseover","transformX(event)");
removePlatformItemBtn.setAttribute("onmouseout","transformY(event)");
removePlatformItemBtn.setAttribute("id","rmBTN_"+platformList.options[platformList.selectedIndex].value);

let pricePerHour = document.createElement("input");
pricePerHour.setAttribute("type","number");
pricePerHour.setAttribute("placeholder","Price Per Hour in EGP");
pricePerHour.setAttribute("id",platformList.options[platformList.selectedIndex].value+"InputId");
pricePerHour.setAttribute("name","price_per_hour_"+platformList.options[platformList.selectedIndex].value);
pricePerHour.setAttribute("formcontrolname","price_per_hour_"+platformList.options[platformList.selectedIndex].value);
pricePerHour.setAttribute("style","border: 2px solid #536DFE;color:white;width: 80%;height: 100%;border-radius: 10px;background-color: rgba(0,0,0,0.3);padding: 10px;padding-top: 5px;");

let platformObj = {platform: "",pricePerHour:""};
platformObj.platform = platformList.options[platformList.selectedIndex].value;
platformObj.pricePerHour = "";
this.selectedPlatforms.push(platformObj);
newDivFour.appendChild(removePlatformItemBtn);
newDivFour.appendChild(pricePerHour);
newDivThree.appendChild(newDivFour);
let newPlatformHeader3 = document.createElement("h5");
newPlatformHeader3.className = "row-styling";
newPlatformHeader3.style.color = "white";
newPlatformHeader3.style.textAlign = "center";
newPlatformHeader3.textContent = platformList.options[platformList.selectedIndex].text;
newDivTwo.appendChild(newPlatformHeader3);
newDivOne.appendChild(newDivTwo);
newDivOne.appendChild(newDivThree);
platfromListDiv.insertBefore(newDivOne,createCyberBtn);
this.previousPlatfrom = platformList.options[platformList.selectedIndex].text;
this.elRef.nativeElement.querySelector('#'+platformList.options[platformList.selectedIndex].value+"InputId").addEventListener('keyup', 
  this.onChangePricePerHour.bind(this,pricePerHour,platformObj));
this.elRef.nativeElement.querySelector('#'+"rmBTN_"+platformList.options[platformList.selectedIndex].value).addEventListener('click', 
  this.removePlatfromItem.bind(this,removePlatformItemBtn,platformObj));
} else {

}
  }

  onChangePricePerHour(pricePerHourElm,platformObj){
    const findElem = (element) => element.platform === platformObj.platform;
    let x = this.selectedPlatforms[this.selectedPlatforms.findIndex(findElem)].pricePerHour = pricePerHourElm.value;
  }
  transformX(event){
    event.target.style.transform = "scale(1.5)";
  }
  transformY(event){
    event.target.style.transform = "scale(-1.5)";
  }
  removeSelectedPlatform(){
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  removePlatfromItem(removeBtn,platformObj){
    var first = removeBtn.parentNode;
    var second = first.parentNode;
    second.parentNode.remove();
    const findElem = (element) => element === platformObj;
    this.selectedPlatforms.splice(this.selectedPlatforms.findIndex(findElem),1)
  }
  async getCyberDetails(){
    await this.communityService.getCyberDetails(this.cyberId).subscribe(data => this.Cyber = data);
  }
  onLogoSelected(event){
    this.selectedLogo = event.target.files[0];
    document.getElementById("logoForCyber").style.border = "0px";
    document.getElementById("logoForCyber").setAttribute("src",URL.createObjectURL(this.selectedLogo))

  }
  onCoverSelected(event){
    this.selectedCover = event.target.files[0];
    document.getElementById("coverForCyber").style.border = "0px";
    document.getElementById("coverForCyber").setAttribute("src",URL.createObjectURL(this.selectedCover))
  }
  onCyberPicturesSelected(event){
    let fragment = document.createDocumentFragment();
    for(let i =0;i<event.target.files.length;i++){
      this.formData.append('cyber_pic_'+i, event.target.files[i],event.target.files[i].name);
      const newImg = document.createElement('img');
      newImg.src = URL.createObjectURL(event.target.files[i]);
      newImg.setAttribute("style",'display: inline-block;height: 100px;width: 200px;margin: auto;padding: 10px');
      newImg.alt = event.target.files[i].name;
      newImg.id = 'cyber_pic_'+i
      fragment.appendChild(newImg);
      let newLi = document.createElement("li")
      newLi.textContent = i+1 + ' - '+event.target.files[i].name
      newLi.style.color = "white"
      document.getElementById("cyberPicturesOrderedList").appendChild(newLi)
      let newDeleteAnchor = document.createElement("a");
      newDeleteAnchor.textContent = '✖';
      newDeleteAnchor.setAttribute("style","margin-left: 10px;color: red;cursor: pointer;font-size: 1.5rem;position: relative;top: 4px;");
      newDeleteAnchor.setAttribute("id","cyberImgDelete"+i);
      newLi.appendChild(newDeleteAnchor);
      this.elRef.nativeElement.querySelector("#cyberImgDelete"+i).addEventListener('click', 
      this.deleteCyberPicture.bind(this));
    }
    document.getElementById("cyberPicturesDiv").appendChild(fragment);
    
  }
  AddCyberOnSubmit(){
    if(this.cyberForm.invalid){
      if((<HTMLInputElement>document.getElementById("changeCoverId")).value === ''){
        document.getElementById("coverForCyber").style.border = "5px solid red";
      }
      if((<HTMLInputElement>document.getElementById("changeLogoId")).value === ''){
        document.getElementById("logoForCyber").style.border = "5px solid red";
      }
      this.spinner = 0;
      this.openSnackBar("Please fill all required fields","Ok");
    }else {
      const extensions = ['jpg','jpeg','png']
      if(extensions.includes(this.selectedLogo.name.split(".")[this.selectedLogo.name.split(".").length-1]) && extensions.includes(this.selectedCover.name.split(".")[this.selectedCover.name.split(".").length-1])){
        this.spinner = 1;
        for(let i=0;i < this.selectedPlatforms.length;i++){
          if(this.selectedPlatforms[i].pricePerHour !== ''){
            let argName = "price_per_hour_"+this.selectedPlatforms[i].platform;
            this.cyberForm.value[argName] = this.selectedPlatforms[i].pricePerHour;
          }
        }
        this.cyberForm.value.starting_working_hour = this.cyberForm.value.starting_working_hour + ' ' + this.cyberForm.value.opensAtSelect;
        this.cyberForm.value.ending_working_hour = this.cyberForm.value.ending_working_hour + ' ' + this.cyberForm.value.closesAtSelect;
        let opensAtSelect = (document.getElementById("opensAtSelect"))  as HTMLSelectElement;
        let location = (document.getElementById("location")) as HTMLInputElement
        this.cyberForm.value.location = location.value+','+this.governate
    
        this.cyberForm.value.token = this.userObjAddCyber.fields.token;
        this.communityService.addCyber(this.cyberForm.value,this.userObjAddCyber.pk).subscribe(data => { 
          this.createdCyber = data; 
          
        },error  => {
          this.spinner = 0;
          this.openSnackBar("Something went wrong.. Sorry","Ok");
        });
        // this.router.navigate(['/places-all']);
        let uploadImg = () => {
          this.formData.append('logo', this.selectedLogo,this.selectedLogo.name);
          this.formData.append('cover', this.selectedCover,this.selectedCover.name);
          this.http.post('http://localhost:8000/add-cyber-pics/'+this.createdCyber[0].pk+'/'+this.userObjAddCyber.pk, this.formData)
            .subscribe(res => {
              this.openSnackBar("Cyber Created Successfully","Ok");
              this.router.navigate(['/place-details',res[0].pk])
            },error  => {
              this.spinner = 0;
              this.openSnackBar("Something went wrong.. Sorry","Ok");
            })
        }
        setTimeout(function(){
          uploadImg();
        },3000)
        
      }else {
        this.spinner = 0;
        this.openSnackBar("Please select a valid extension!","Ok");
      }

    }
    
  }
  onClickChangeCyberCover(): void {
    document.getElementById("changeCoverId").click()
}
onClickChangeCyberLogo(): void {
  document.getElementById("changeLogoId").click()
}
addCyberPicture(event){
  document.getElementById("cyberImagesId").click();
  
}
uploadAddedPicture(event){
  for(let i =0;i<event.target.files.length;i++){
    this.formData.append('cyber_pic_'+i, event.target.files[i],event.target.files[i].name);
  }
}
onUploadGalleryPicture(elmID){
  document.querySelector(elmID);
}

deleteCyberPicture(event){
  let index = parseInt(event.target.parentElement.textContent[0])-1
  this.formData.delete('cyber_pic_'+index)
  document.getElementById("cyberPicturesDiv").removeChild( document.getElementById('cyber_pic_'+index))
  document.getElementById("cyberPicturesOrderedList").removeChild(event.target.parentElement)
}


}