import { SimpleChange } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-widget',
  templateUrl: './loading-widget.component.html',
  styleUrls: ['./loading-widget.component.css']
})
export class LoadingWidgetComponent implements OnInit {
  @Input() spinner : number;
  loadingText = "Loading";
  constructor() { }

  ngOnInit(): void {
  }
}
