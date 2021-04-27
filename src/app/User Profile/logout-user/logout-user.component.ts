import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {Router} from "@angular/router";
@Component({
  selector: 'app-logout-user',
  templateUrl: './logout-user.component.html',
  styleUrls: ['./logout-user.component.css']
})
export class LogoutUserComponent implements OnInit, OnDestroy  {

  token = this.cookieService.get('etak-start-token') || '';
  @Output() tokenChange = new EventEmitter<any>();
  spinner= 0;
  constructor(private cookieService: CookieService,private router: Router) { }
  ngOnInit(): void {
    this.tokenChange.emit('')
    this.spinner = 1;
    setTimeout(()=>{
      this.router.navigate(['']);
    },500)
  }
  async logout(){
    this.tokenChange.emit('')
    setTimeout(()=>{
      this.router.navigate(['']);
    },500)
  }
  ngOnDestroy() {
    window.location.reload();
  }
}
