import { Component, OnInit, OnDestroy, Input, SimpleChange,AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CommunityService } from '../../etakstart.service';

import { DeleteUserModalComponent } from '../delete-user-modal/delete-user-modal.component';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-profile-info',
  templateUrl: './edit-profile-info.component.html',
  styleUrls: ['./edit-profile-info.component.css']
})
export class EditProfileInfoComponent implements OnInit {
  userObjEditProfileInfo: any;
  token = this.cookieService.get('etak-start-token') || '';
  spinner = 0;
  hide = true;
  enableConfirm = false;
  stopLoop = true;
  userForm = new FormGroup({
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    // username: new FormControl(''),
    email: new FormControl(''),
    phone_number: new FormControl(''),
    password: new FormControl(''),
    date_of_birth: new FormControl(''),
    // show_or_hide_email: new FormControl(''),
    // show_or_hide_phone_number: new FormControl(''),
  }, [Validators.required]);
  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  userLinkForm = new FormGroup({
    name: new FormControl(''),
    link: new FormControl('', [Validators.required, Validators.pattern(this.reg)]),
  }, [Validators.required]);
  regex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$");
  regexCheckLink = new RegExp('/(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi');
  isCheckedEmail;
  isCheckedPhone;
  isCheckedCreatorMode;
  isCheckedDateOfBirth;
  userLinks;
  newLink;
  name;
  link;
  toEditLinkPK;
  toEditLinkElement;
  constructor(private cookieService: CookieService,private elRef:ElementRef,private communityService: CommunityService,private route: ActivatedRoute,private router: Router,public dialog: MatDialog,private http: HttpClient,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    
    if(!this.token){
      this.router.navigate(['homepage']);
    } else {
      if(this.userObjEditProfileInfo){
        
      }else {
        this.checkUser()
      }
    }
    
  }
  checkUser(){
    setTimeout(()=>{
      this.userObjEditProfileInfo = this.communityService.getUserObj()
      if(this.userObjEditProfileInfo){
        if(this.userObjEditProfileInfo.fields.show_or_hide_email === "1"){
          this.isCheckedEmail = true;
        }else {
          this.isCheckedEmail = false;
        }
        if(this.userObjEditProfileInfo.fields.show_or_hide_phone_number === "1"){
          this.isCheckedPhone = true;
        }else {
          this.isCheckedPhone = false;
        }
        if(this.userObjEditProfileInfo.fields.show_or_hide_date_of_birth === "1"){
          this.isCheckedDateOfBirth = true;
        }else {
          this.isCheckedDateOfBirth = false;
        }
        if(this.userObjEditProfileInfo.fields.is_content_creator === "1"){
          this.isCheckedCreatorMode = true;
        }else {
          this.isCheckedCreatorMode = false;
        }
        this.userForm.setValue({
          first_name: this.userObjEditProfileInfo.fields.first_name,
          last_name: this.userObjEditProfileInfo.fields.last_name,
          // username: this.userObjEditProfileInfo.fields.username,
          email: this.userObjEditProfileInfo.fields.email,
          phone_number: this.userObjEditProfileInfo.fields.phone_number,
          password: '',
          date_of_birth: this.userObjEditProfileInfo.fields.date_of_birth,
          // show_or_hide_email: this.userObjEditProfileInfo.fields.show_or_hide_email,
          // show_or_hide_phone_number: this.userObjEditProfileInfo.fields.show_or_hide_phone_number,
        })
        this.communityService.getAllUserLinks(this.userObjEditProfileInfo.pk).subscribe(data =>{
          this.userLinks = data
        },error =>{
          this.openSnackBar(error.message,"Ok");
        })
        return 0;
      }else {
        return this.checkUser()
      }
    },500)
  }
  ngAfterViewInit() {
    
    // let governateList = (document.querySelector("#governateList"))  as HTMLSelectElement
    // for(let i = 0;i<governateList.children.length;i++){
    //   if(governateList.options[i].value === this.userObjEditProfileInfo.fields.governate){
    //     governateList.options[i].setAttribute("selected","true")
    //   }else {
    //   }
    // }
 }
 onChangeShowEmailSlide(event){
   let setting = "";
   if(this.isCheckedEmail === true){
    setting = "1"
  }else {
    setting = "0"
  }
   this.communityService.changeShowHideEmailSetting(setting,this.userObjEditProfileInfo.pk).subscribe(data =>{
    this.openSnackBar(data.message,"Ok");
   })
 }
 onChangeShowPhoneNumberSlide(event){
  let setting = "";
  if(this.isCheckedPhone === true){
   setting = "1"
 }else {
   setting = "0"
 }
  this.communityService.changeShowHidePhoneNumberSetting(setting,this.userObjEditProfileInfo.pk).subscribe(data =>{
   this.openSnackBar(data.message,"Ok");
  })
}
onChangeShowDateOfBirthSlide(event){
  let setting = "";
  if(this.isCheckedDateOfBirth === true){
   setting = "1"
 }else {
   setting = "0"
 }
  this.communityService.changeShowHideDateOfBirthSetting(setting,this.userObjEditProfileInfo.pk).subscribe(data =>{
   this.openSnackBar(data.message,"Ok");
  })
}
onChangeContentCreatorMode(event){
  let setting = "";
  if(this.isCheckedCreatorMode === true){
   setting = "1"
 }else {
   setting = "0"
 }
  this.communityService.changeCreatorMode(setting,this.userObjEditProfileInfo.pk).subscribe(data =>{
   this.openSnackBar(data.message,"Ok");
  })
}
 ngOnChanges(changes: SimpleChange): void {
  
  
 }
 checkRegister(event: KeyboardEvent){
  const passwordField = this.userForm.get('password');
  if(passwordField.value === ""){
    this.enableConfirm = false;
  } else if(event.key === "Backspace" && passwordField.value.length > 3){
    if(this.regex.test(passwordField.value)){
      this.enableConfirm = true;
      document.getElementById("errorMessage").textContent = ""
    }else {
      this.enableConfirm = false;
      document.getElementById("errorMessage").textContent = "Password Must include a Minimum of six characters, at least one uppercase letter and one lowercase letter:"
    }
  }
  else if(passwordField.value.length > 3){
    if(this.regex.test(passwordField.value)){
      this.enableConfirm = true;
      document.getElementById("errorMessage").textContent = ""
    }else {
      this.enableConfirm = false;
      document.getElementById("errorMessage").textContent = "Password Must include a Minimum of six characters, at least one uppercase letter and one lowercase letter:"
    }
    
  }
  else {
    this.enableConfirm = false;
  }
};
  openDialog(): void {
    const dialogRef = this.dialog.open(DeleteUserModalComponent, {
      width: '500px',
      height: '450px',
      data: this.userObjEditProfileInfo
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  refreshPage() {
    this.router.navigate(['/my-profile/'+this.userObjEditProfileInfo.pk])
   } 
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  onSubmit(){
    if(this.userForm.invalid){
      this.spinner = 0;
      this.openSnackBar("Please fill required fields with valid inputs","Ok");
    }else {
      let date = new Date();
      if(date.getFullYear() - new Date(this.userForm.value.date_of_birth).getFullYear() >= 10){
        this.spinner = 1;
      const formData = new FormData(document.querySelector('#edifProfileForm'))
      for (var pair of formData.entries()) {
        this.userForm.value[pair[0]] = pair[1];
  }
  if(this.isCheckedPhone === true){
    this.userForm.value.show_or_hide_phone_number = '1'
  }else {
    this.userForm.value.show_or_hide_phone_number = '0'
  }
  // let governateSelect = (document.getElementById("governateList"))  as HTMLSelectElement;
  // this.userForm.value['governate'] = governateSelect.options[governateSelect.selectedIndex].text;
  this.communityService.editProfileInfo(this.userForm.value,this.userObjEditProfileInfo.pk).subscribe(userobj => {
    this.openSnackBar("Profile Updated Successfully","Ok");
    this.router.navigate(['/profiles/'+this.userObjEditProfileInfo.pk])
  },error => {
    this.spinner = 0;
    this.openSnackBar("Something went wrong.. Sorry","Ok");
  });

      }else {
        this.spinner = 0;
        this.openSnackBar("Date of Birth is not valid!","Ok");
      }
    }
  }
  deleteUser(event){

  }
  checkPhoneNumber(event){
    if(event.target.value.length !== 11){
      document.getElementById("errorMessagePhone").textContent = "Phone Number Must Be 11 Numbers Long"
    }else {
      let phoneNumberCodes = ['010','011','012','015']
      if(phoneNumberCodes.includes(event.target.value.slice(0,3))){
        document.getElementById("errorMessagePhone").textContent = ""
      }else {
        document.getElementById("errorMessagePhone").textContent = "Phone Number Must Start With 010,011,012 or 015!"
      }
    }
  }
  ngOnDestroy(){
    window.location.reload();
  }
  createUserLink(event){
    if(this.userLinkForm.invalid){
      this.openSnackBar("Please fill all required fields & make sure to use a valid Link!","Ok");
    }else{
        this.spinner = 1;
        this.communityService.createUserLink(this.userLinkForm.value,this.userObjEditProfileInfo.pk).subscribe(data=>{
          this.newLink = data[0]
          let newLinkSpan = document.createElement("span")
          newLinkSpan.style.marginRight = "5px";
          newLinkSpan.textContent = this.newLink.fields.name + ': '
          let newLinkAnchorEdit = document.createElement("a")
          newLinkAnchorEdit.style.marginRight = "5px";
          newLinkAnchorEdit.id = 'editLink_' + this.newLink.pk
          newLinkAnchorEdit.innerHTML = '<i class="fas fa-edit"></i>';
          let newLinkAnchorDelete = document.createElement("a")
          newLinkAnchorDelete.style.marginRight = "5px";
          newLinkAnchorDelete.id = 'deleteLink_' + this.newLink.pk
          newLinkAnchorDelete.innerHTML = '<i class="fas fa-trash-alt"></i>';
          let newLinkAnchorLink = document.createElement("a");
          newLinkAnchorLink.setAttribute("style","display: block;font-size: 0.9rem;");
          newLinkAnchorLink.setAttribute("target","_blank");
          newLinkAnchorLink.setAttribute("href",this.newLink.fields.link);
          newLinkAnchorLink.textContent = this.newLink.fields.link;
          let newHR = document.createElement("hr")
          let newLinkLi = document.createElement("li")
          newLinkLi.style.color = "white"
          newLinkLi.append(newLinkSpan,newLinkAnchorEdit,newLinkAnchorDelete,newLinkAnchorLink,newHR)
          document.getElementById("linksOrderedList").appendChild(newLinkLi)
          this.elRef.nativeElement.querySelector('#'+'editLink_' + this.newLink.pk).addEventListener('click', 
      this.editUserLink.bind(this,this.newLink));
      this.elRef.nativeElement.querySelector('#'+'deleteLink_' + this.newLink.pk).addEventListener('click', 
      this.deleteUserLink.bind(this,this.newLink));
          this.spinner = 0;
          this.name = '';
      this.link = '';
      this.userLinkForm.setValue({
        name: '',
        link: '',
      })
        },error => {
          this.spinner = 0;
          this.openSnackBar("Something went wrong.. Sorry","Ok");
        })
      
    }
   
  }
  editUserLink(link){
    this.name = link.fields.name;
    this.link = link.fields.link;
    document.getElementById("saveBtn").style.display = "block";
    document.getElementById("addBtn").style.display = "none";
    this.toEditLinkPK = link.pk;
    this.toEditLinkElement = document.getElementById("editLink_"+link.pk)
    this.userLinkForm.setValue({
      name: this.name,
      link: this.link,
    })
  }
  deleteUserLink(link){
    this.spinner = 1;
    this.communityService.deleteUserLink(link.pk,this.userObjEditProfileInfo.pk).subscribe(data=>{
      this.openSnackBar(data.message,"Ok");
      document.getElementById("linksOrderedList").removeChild(document.getElementById("deleteLink_"+link.pk).parentElement)
      this.spinner = 0;
      this.name = '';
      this.link = '';
      this.userLinkForm.setValue({
        name: '',
        link: '',
      })
    })
  }
  editUserLinkSubmit(event){
    this.spinner = 1;
    this.communityService.editUserLink(this.userLinkForm.value,this.toEditLinkPK,this.userObjEditProfileInfo.pk).subscribe(data=>{
      this.newLink = data[0]
      document.getElementById("editLink_"+this.newLink.pk).parentElement.children[0].textContent = this.newLink.fields.name;
      document.getElementById("editLink_"+this.newLink.pk).parentElement.children[3].textContent = this.newLink.fields.link;
      this.spinner = 0;
      this.name = '';
      this.link = '';
      this.userLinkForm.setValue({
        name: '',
        link: '',
      })
      document.getElementById("saveBtn").style.display = "none";
      document.getElementById("addBtn").style.display = "block";
    },error => {
      this.spinner = 0;
      this.openSnackBar("Something went wrong.. Sorry","Ok");
    })
  }
}
