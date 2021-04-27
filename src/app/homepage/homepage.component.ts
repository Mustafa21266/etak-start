import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  userObj = ['yyyyy'];
  spinner = 1;
  constructor() { }
  ngOnInit(): void {
  }
  myClickStart(event){
    
  }
  

}
