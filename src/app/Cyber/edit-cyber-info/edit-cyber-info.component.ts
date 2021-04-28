import { Component, OnInit, OnDestroy, OnChanges, ElementRef, Input} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CommunityService } from '../../etakstart.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ChangeProfilePictureComponent} from '../../change-profile-picture/change-profile-picture.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DeleteCyberComponent } from '../delete-cyber/delete-cyber.component';
import {ImageUploadComponent} from '../../image-upload/image-upload.component';
import {Loader, LoaderOptions} from 'google-maps';

interface data {
  candidates: Array<any>,
  geometry: Object,
  viewport:  Object,
  name: string
}
@Component({
  selector: 'app-edit-cyber-info',
  templateUrl: './edit-cyber-info.component.html',
  styleUrls: ['./edit-cyber-info.component.css']
})
export class EditCyberInfoComponent implements OnInit {
  userObjEditCyberInfo: any;
  cyberId: number;
  token = this.cookieService.get('etak-start-token') || '';
  Cyber = [];
  CyberPictures = [];
  CyberPicturesTextList = [];
  spinner = 0;
  loadingText = "Loading";
  hide = true;
  enableRegister = false;
  stopLoop = true;
  cyberForm = new FormGroup({
    name: new FormControl(''),
    location: new FormControl(''),
    governate: new FormControl(''),
    description: new FormControl(''),
    starting_working_hour: new FormControl(''),
    ending_working_hour: new FormControl(''),
    opensAtSelect:  new FormControl(''),
    closesAtSelect:  new FormControl(''),
    logo: new FormControl(''),
    cover: new FormControl(''),
    price_per_hour_ps3: new FormControl('0.0'),
    price_per_hour_ps4: new FormControl('0.0'),
    price_per_hour_ps5: new FormControl('0.0'),
    price_per_hour_xbox_360: new FormControl('0.0'),
    price_per_hour_xbox_one: new FormControl('0.0'),
    price_per_hour_xbox_series_x: new FormControl('0.0'),
    price_per_hour_pc: new FormControl('0.0'),
    price_per_hour_vr: new FormControl('0.0'),
  }, [Validators.required]);

  cyberPictureForm = new FormGroup({
    cyber_pics: new FormControl('0.0')
  }, [Validators.required]);
  formData = new FormData();
  selectedPlatforms = [];
  previousPlatfrom: string; 
  map;
  marker;
  apiLink = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=';
  attrs = '&inputtype=textquery&fields=name,geometry&key=AIzaSyD--3IwVc2MTQWjd6i6tBC2RQrYeOBP8s0';
  locationObj = {};
  governates = [{value:'Alexandria',},{value:'Aswan',},{value:'Asyut',},{value:'Beheira',},{value:'Beni Suef',},{value:'Cairo',},{value:'Dakahlia',},{value:'Damietta',},{value:"Faiyum",},{value:'Gharbia',},{value:"Giza",},{value:"Ismailia",},{value:"Kafr El Sheikh",},{value:'Luxor',},{value:"Matruh",},{value:'Minya',},{value:'Monufia',},{value:"New Valley",},{value:"North Sinai",},{value:"Port Said",},{value:"Qalyubia",},{value:"Qena",},{value:"Red Sea",},{value:"Sharqia",},{value:'Sohag',},{value:"South Sinai",},{value:"Suez",}]
  governate : string;
  opensAtSelect :number;
  closesAtSelect :number;
  constructor(public dialog: MatDialog,private elRef:ElementRef,private cookieService: CookieService,private communityService: CommunityService,private route: ActivatedRoute,private router: Router,private http: HttpClient,private _snackBar: MatSnackBar) { }
  onClickThatsIt(event){
    document.getElementById("findBtn").style.display = 'none';
  }
  ngOnInit(): void {
    if(!this.token ){
      this.router.navigate(['homepage']);
    } else {
      setTimeout(()=>{
        this.userObjEditCyberInfo = this.communityService.getUserObj()
        if(this.userObjEditCyberInfo.fields.is_cyber_owner === '0'){
          this.router.navigate(['homepage']);
        }
      },500)
      this.cyberId = parseInt(this.router.url.replace("/edit-cyber-info/",""));
      this.getCyberDetails();
          this.communityService.getCyberPictures(this.cyberId).subscribe(data => {
            this.CyberPictures = data
            for(let i = 0; i<this.CyberPictures.length;i++){
              let cyberPicturesList = data[i].fields.cyber_pics.split("/");
              this.CyberPicturesTextList[i] = cyberPicturesList[1];
            }
          });
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
  cardMouseEnter(event){
    // event.target.firstChild.nextSibling.firstChild.style.visibility = "visible"
    event.target.style.filter = 'brightness(1.5)';
    event.target.style.border = '5px solid white';
    
  }
  cardMouseLeave(event){
    // event.target.firstChild.nextSibling.firstChild.style.visibility = "hidden"
    event.target.style.filter = 'brightness(1)';
    event.target.style.border = '0px';
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DeleteCyberComponent, {
      width: '500px',
      height: '450px',
      data: [this.Cyber[0],this.userObjEditCyberInfo]
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openDialogChangeCyberProfilePicture(): void {
    const dialogRef = this.dialog.open(ChangeProfilePictureComponent, {
      width: '500px',
      height: '450px',
      data: [this.userObjEditCyberInfo,this.Cyber[0]]
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openDialogChangeCyberCover(): void {
    const dialogRef = this.dialog.open(ImageUploadComponent, {
      width: '500px',
      height: '450px',
      data: [this.userObjEditCyberInfo,this.Cyber[0]]
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  getCyberDetails(): void {
    this.communityService.getCyberDetails(this.cyberId).subscribe(data => {
      this.Cyber = data
      this.governate = this.Cyber[0].fields.governate
      this.cyberForm.setValue({
        name: this.Cyber[0].fields.name,
        location: this.Cyber[0].fields.location.split(",")[0],
        governate: this.Cyber[0].fields.governate,
        description: this.Cyber[0].fields.description,
        logo: '',
        cover: '',
        starting_working_hour: this.Cyber[0].fields.starting_working_hour.substring(0,5),
        ending_working_hour: this.Cyber[0].fields.ending_working_hour.substring(0,5),
        opensAtSelect:  this.Cyber[0].fields.starting_working_hour.substring(6,8),
        closesAtSelect:  this.Cyber[0].fields.ending_working_hour.substring(6,8),
        price_per_hour_ps3: this.Cyber[0].fields.price_per_hour_ps3,
        price_per_hour_ps4: this.Cyber[0].fields.price_per_hour_ps4,
        price_per_hour_ps5: this.Cyber[0].fields.price_per_hour_ps5,
        price_per_hour_xbox_360: this.Cyber[0].fields.price_per_hour_xbox_360,
        price_per_hour_xbox_one: this.Cyber[0].fields.price_per_hour_xbox_one,
        price_per_hour_xbox_series_x: this.Cyber[0].fields.price_per_hour_xbox_series_x,
        price_per_hour_pc: this.Cyber[0].fields.price_per_hour_pc,
        price_per_hour_vr: this.Cyber[0].fields.price_per_hour_vr,
      })
    this.preparePlatform()
    }
    );
   
   
  }
  preparePlatform(){
    let platformList = (document.getElementById("platformsList"))  as HTMLSelectElement;
    let platfromListDiv = document.getElementById("editCyberForm");
    let createCyberBtn = document.getElementById("createCyberBtn");
    let platformList_array = [...platformList].slice(1,platformList.children.length); // converts NodeList to Array
    platformList_array.forEach(div => {
      let newDivOne = document.createElement("div");
      newDivOne.className = "form-row";
      let newDivTwo = document.createElement("div");
      newDivTwo.className = "form-group col-4";
      let newDivThree = document.createElement("div");
      newDivThree.className = "form-group col-8";
      let newDivFour = document.createElement("div");
      newDivFour.className = "remove-platform-btn";
      let pricePerHour = document.createElement("input");
      pricePerHour.setAttribute("type","number");
      pricePerHour.setAttribute("value",this.Cyber[0].fields['price_per_hour_'+div.getAttribute("value")]);
      pricePerHour.setAttribute("placeholder","Price Per Hour in EGP");
      pricePerHour.setAttribute("id",div.getAttribute("value")+"InputId");
      pricePerHour.setAttribute("name","price_per_hour_"+div.getAttribute("value"));
      pricePerHour.setAttribute("formcontrolname","price_per_hour_"+div.getAttribute("value"));
      pricePerHour.setAttribute("style","border: 2px solid #536DFE;color:white;width: 80%;height: 100%;border-radius: 10px;background-color: rgba(0,0,0,0.3);padding: 10px;padding-top: 5px;");
      let platformObj = {platform: "",pricePerHour:""};
      platformObj.platform = div.getAttribute("value");
      platformObj.pricePerHour = "";
      this.selectedPlatforms.push(platformObj);
      newDivFour.appendChild(pricePerHour);
      newDivThree.appendChild(newDivFour);
      let newPlatformHeader3 = document.createElement("h5");
      newPlatformHeader3.className = "row-styling";
      newPlatformHeader3.style.color = "white";
      newPlatformHeader3.style.textAlign = "center";
      newPlatformHeader3.textContent = div.textContent;
      newDivTwo.appendChild(newPlatformHeader3);
      newDivOne.appendChild(newDivTwo);
      newDivOne.appendChild(newDivThree);
      platfromListDiv.insertBefore(newDivOne,createCyberBtn);
      this.previousPlatfrom = div.textContent;
      this.elRef.nativeElement.querySelector('#'+div.getAttribute("value")+"InputId").addEventListener('keyup', 
        this.onChangePricePerHour.bind(this,pricePerHour,platformObj));
    });
      }
      onChangePricePerHour(pricePerHourElm,platformObj){
        const findElem = (element) => element.platform === platformObj.platform;
        let x = this.selectedPlatforms[this.selectedPlatforms.findIndex(findElem)].pricePerHour = pricePerHourElm.value;
      }
      removePlatfromItem(removeBtn,platformObj){
        var first = removeBtn.parentNode;
        var second = first.parentNode;
        second.parentNode.remove();
        const findElem = (element) => element === platformObj;
        this.selectedPlatforms.splice(this.selectedPlatforms.findIndex(findElem),1);
      }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  onSubmit(){
    if(this.cyberForm.invalid){
      this.spinner = 0;
    this.openSnackBar("Please fill all required fields","Ok");
  }else {
    this.spinner = 1;
    const formData = new FormData(document.querySelector('#editCyberForm'))
    for (var pair of formData.entries()) {
      this.cyberForm.value[pair[0]] = pair[1];
}
this.cyberForm.value.starting_working_hour = this.cyberForm.value.starting_working_hour + ' ' + this.cyberForm.value.opensAtSelect;
this.cyberForm.value.ending_working_hour = this.cyberForm.value.ending_working_hour + ' ' + this.cyberForm.value.closesAtSelect;
let location = (document.getElementById("location")) as HTMLInputElement
this.cyberForm.value.location = location.value+','+this.governate
this.communityService.editCyberInfo(this.cyberForm.value,this.Cyber[0].pk,this.userObjEditCyberInfo.pk).subscribe(cyberObj => {
  this.Cyber[0] = cyberObj[0]
  this.openSnackBar("Cyber Updated Successfully","Ok");
  this.router.navigate(['/place-details/'+this.Cyber[0].pk])
},error => {
  this.spinner = 0;
  this.openSnackBar("Something went wrong.. Sorry","Ok");
});
  }
}
  deleteCyberPicture(event){
    this.spinner = 1;
      this.cyberPictureForm.value['cyber_pics'] = event.target.parentNode.textContent.replace("✖","");
      const headers = { 
        'content-type': 'application/json',
        'Authorization': this.userObjEditCyberInfo.fields.token,
      }; 
      const body=JSON.stringify(this.cyberPictureForm.value);
      this.http.post('https://etak-start-api.herokuapp.com/delete-cyber-picture/'+this.Cyber[0].pk+'/'+this.userObjEditCyberInfo.pk, body,{'headers':headers})
        .subscribe(res => {
          this.openSnackBar("Picture Removed Successfully","Ok");
          let cyberPicturesOrderedList = document.getElementById("cyberPicturesOrderedList");
          cyberPicturesOrderedList.removeChild(event.target.parentNode);
          let cyberPicturesDiv = document.getElementById("cyberPicturesDiv");
          let cyberPicturesDivChildren = document.getElementById("cyberPicturesDiv").children;
          for(let i =0;i<cyberPicturesDivChildren.length;i++){
            if(cyberPicturesDivChildren[i].getAttribute("src").includes(event.target.parentNode.textContent.replace("✖",""))){
              cyberPicturesDiv.removeChild(cyberPicturesDivChildren[i]);
            }

          }
          this.spinner = 0;
          setTimeout(()=>{            
          },2000)
        },error  => {
          this.spinner = 0;
          this.openSnackBar("Something went wrong.. Sorry","Ok");
        })
    
  }
  addCyberPicture(event){
    document.getElementById("addPic").click();
    
  }
  onUploadGalleryPicture(elmID){
    document.querySelector(elmID);
  }
  uploadAddedPicture(event){
    this.spinner = 1;
    const extensions = ['jpg','jpeg','png']
    for(let i =0;i<event.target.files.length;i++){
      if(extensions.includes(event.target.files[i].name.split(".")[event.target.files[i].name.split(".").length-1])){
      this.formData.append('cyber_pic_'+i, event.target.files[i],event.target.files[i].name);
      setTimeout(()=>{
          let newList = document.createElement("li");
      newList.textContent =  event.target.files[i].name;
      newList.style.color = "white"
      let newDeleteAnchor = document.createElement("a");
      newDeleteAnchor.textContent = '✖';
      newDeleteAnchor.setAttribute("style","margin-left: 10px;color: red;cursor: pointer;font-size: 1.5rem;position: relative;top: 4px;");
      newDeleteAnchor.setAttribute("id","cyberImgDelete"+i);
      newList.appendChild(newDeleteAnchor);
      
      let cyberPicturesOrderedList = document.getElementById("cyberPicturesOrderedList");
      cyberPicturesOrderedList.appendChild(newList);
      let newImg = document.createElement("img");
      
      newImg.setAttribute("style","display: inline-block;height: 100px;width: 200px;margin: auto;padding: 10px");
      newImg.setAttribute("src",'https://etak-start.s3.eu-west-3.amazonaws.com/media/cyber_pictures/'+event.target.files[i].name);
      let cyberPicturesDiv = document.getElementById("cyberPicturesDiv");
      cyberPicturesDiv.appendChild(newImg);
      this.elRef.nativeElement.querySelector("#cyberImgDelete"+i).addEventListener('click', 
  this.deleteCyberPicture.bind(this));
      },2000)
    }else {
      this.spinner = 0;
      this.openSnackBar("Please select a valid extension!","Ok");
    }
  }
  this.http.post('https://etak-start-api.herokuapp.com/add-cyber-pics/'+this.Cyber[0].pk+'/'+this.userObjEditCyberInfo.pk, this.formData)
  .subscribe(res => {
    this.openSnackBar("Picture Added to Gallery Successfully","Ok");
    this.spinner = 0;
  },error  => {
    this.spinner = 0;
    this.openSnackBar("Something went wrong.. Sorry","Ok");
  })
}
  ngOnDestroy(){
    window.location.reload();
  }
}






