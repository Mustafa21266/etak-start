import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../../etakstart.service';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-cybers-all',
  templateUrl: './cybers-all.component.html',
  styleUrls: ['./cybers-all.component.css']
})
export class CybersAllComponent implements OnInit {
  Cybers = [];
  originalCybers = [];
  readOnlyValue = true;
  config: NgbRatingConfig;
  allRates = 0;
  averageRating = 0;
  total = 0;
  constructor(private communityService: CommunityService,config: NgbRatingConfig,private _snackBar: MatSnackBar) { 
    config.max = 5;
  }
  searchResultsChange(results){
    this.Cybers = results
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}
  ngOnInit(): void {
    this.getAllCybers();
    setTimeout(()=>{
    },1000)
  }
  async getAllCybers(){
    await this.communityService.getAllCybers().subscribe(data => {
      this.Cybers = this.shuffleArray(data)
      this.originalCybers = this.Cybers
      
    });
    
  }
  filterByCheckBox(event){
    if(event.target.value === 'highestRating'){
      if(event.target.classList.contains("checked")){

      }else {
        event.target.classList.add("checked")
        document.getElementById("newlyCreated").classList.remove("checked")
        this.communityService.getAllCybersHighestRating().subscribe(data =>{
          this.Cybers = data
        },error =>{
          this.openSnackBar("Something went wrong.. Sorry","Ok");
        })
      }
      document.getElementById("newlyCreated").removeAttribute("checked")

    }else if (event.target.value === 'newlyCreated'){
      document.getElementById("highestRating").removeAttribute("checked")
      if(event.target.classList.contains("checked")){

      }else {
        event.target.classList.add("checked")
        document.getElementById("highestRating").classList.remove("checked")
        this.communityService.getAllCybersNewlyCreated().subscribe(data =>{
          this.Cybers = data
        },error =>{
          this.openSnackBar("Something went wrong.. Sorry","Ok");
        })
      }
      
    }else if (event.target.value === 'originalSort') {
      event.target.classList.add("checked")
        document.getElementById("highestRating").classList.remove("checked")
        document.getElementById("newlyCreated").classList.remove("checked")
        this.Cybers = this.originalCybers
    }
  }
  cardMouseEnter(event){
    // event.target.firstChild.nextSibling.firstChild.style.visibility = "visible"
    event.target.firstChild.style.filter = 'opacity(75%)';
    
  }
  cardMouseLeave(event){
    // event.target.firstChild.nextSibling.firstChild.style.visibility = "hidden"
    event.target.firstChild.style.filter = 'opacity(100%)';
  }
}
