import {Directive, Renderer2, ElementRef, SimpleChange } from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pagination-component',
  templateUrl: './pagination-component.component.html',
  styleUrls: ['./pagination-component.component.css']
})
export class PaginationComponentComponent implements OnInit {
  @Input() searchResults: any;
  currentPage: number;
  originalSearchResults = [];
  pagination = [];
  previousPage = 1;
  nextPage = 2;
  @Output() searchResultsChange = new EventEmitter<any>();
  // @Output() currentPageChange = new EventEmitter<any>();
  searchTerm: string;
  constructor(private elRef:ElementRef,private renderer: Renderer2,public router: Router,private route: ActivatedRoute) { }

  ngOnInit(): void {
      // this.searchResults = dataArray
      this.route.queryParams.subscribe(params => {
        console.group(params)
        if(params['term']){
          this.searchTerm = params['term'];
        }
        this.currentPage = parseInt(params['pageNumber']);
      });
    this.prepareSearchBar()
  }
prepareSearchBar(){
  // this.searchBar = false
  setTimeout(()=>{
  this.originalSearchResults = this.searchResults
  let index = Math.ceil(this.searchResults.length/9)
  this.pagination = new Array(index)
  // this.searchBar = true
  setTimeout(() =>{
    
    if(document.getElementById("page_1")){
      document.getElementById("page_1").parentElement.classList.add("active")
      document.getElementById("firstPage").parentElement.classList.add("disabled")
      if(this.pagination.length === 1){
        // document.getElementById("page_"+1).parentElement.classList.add("active")
        // this.currentPage = this.currentPage+1;
        document.getElementById("firstPage").parentElement.classList.add("disabled")
        document.getElementById("lastPage").parentElement.classList.add("disabled")
        
      }
      // this.currentPage = parseInt(document.getElementById('pagination').children[1].firstChild.textContent)
      // 
      
    }
   
  },500)
    
  },500)
}
  // ngOnChanges(changes: SimpleChange): void {
  //   this.searchResults = changes.searchResults.currentValue
  // }

  onClickPrevOrNextOrIndex(event){
    for(let i = 0;i<document.getElementsByClassName("pagination")[0].children.length;i++){
      document.getElementsByClassName("pagination")[0].children[i].classList.remove("active")
    }
    if(event.target.textContent === 'Previous'){
      this.currentPage = this.currentPage -1
      this.nextPage = this.currentPage + 1
      this.previousPage = this.currentPage - 1
      if(this.searchTerm){
        this.router.navigate([this.router.url.replace("/","").split("?")[0]], { queryParams: { term: this.searchTerm,pageNumber: this.currentPage } })
      }else {
        this.router.navigate([this.router.url.replace("/","").split("?")[0]], { queryParams: { pageNumber: this.currentPage } })
      }
      
      // 
    }else if (event.target.textContent === 'Next'){
      this.currentPage = this.currentPage + 1
      this.nextPage = this.currentPage + 1
      this.previousPage = this.currentPage - 1
      if(this.searchTerm){
        this.router.navigate([this.router.url.replace("/","").split("?")[0]], { queryParams: { term: this.searchTerm,pageNumber: this.currentPage } })
      }else {
        this.router.navigate([this.router.url.replace("/","").split("?")[0]], { queryParams: { pageNumber: this.currentPage } })
      }
      // 
    }else if (parseInt(event.target.textContent) === this.currentPage + 1){
      this.currentPage = this.currentPage + 1
      this.nextPage = this.currentPage + 1
      this.previousPage = this.currentPage - 1
      if(this.searchTerm){
        this.router.navigate([this.router.url.replace("/","").split("?")[0]], { queryParams: { term: this.searchTerm,pageNumber: this.currentPage } })
      }else {
        this.router.navigate([this.router.url.replace("/","").split("?")[0]], { queryParams: { pageNumber: this.currentPage } })
      }
      
    }else if (parseInt(event.target.textContent) === this.currentPage - 1){
      this.currentPage = this.currentPage -1
      this.nextPage = this.currentPage + 1
      this.previousPage = this.currentPage - 1
      if(this.searchTerm){
        this.router.navigate([this.router.url.replace("/","").split("?")[0]], { queryParams: { term: this.searchTerm,pageNumber: this.currentPage } })
      }else {
        this.router.navigate([this.router.url.replace("/","").split("?")[0]], { queryParams: { pageNumber: this.currentPage } })
      }
      
    }else {
      this.currentPage = parseInt(event.target.textContent)
      this.nextPage = this.currentPage + 1
      this.previousPage = this.currentPage - 1
      if(this.searchTerm){
        this.router.navigate([this.router.url.replace("/","").split("?")[0]], { queryParams: { term: this.searchTerm,pageNumber: this.currentPage } })
      }else {
        this.router.navigate([this.router.url.replace("/","").split("?")[0]], { queryParams: { pageNumber: this.currentPage } })
      }
      
    }
    this.onClickChangePage(this.currentPage)
  }
  onClickChangePage(event){
    this.currentPage = event
    for(let i = 0;i<document.getElementsByClassName("pagination")[0].children.length;i++){
      document.getElementsByClassName("pagination")[0].children[i].classList.remove("active")
    }
        this.searchResults = this.originalSearchResults.slice((this.currentPage-1)*10,(this.currentPage-1)*10+10);
        document.getElementById("page_"+this.currentPage).parentElement.classList.add("active")
        if(this.currentPage === 1){
          document.getElementById("page_"+1).parentElement.classList.add("active")
          document.getElementById("lastPage").parentElement.classList.remove("disabled")
          document.getElementById("firstPage").parentElement.classList.add("disabled")
          
        } else if(this.currentPage === this.pagination.length){
          document.getElementById("pagination").children[document.getElementById("pagination").children.length-1].classList.add("active")
          document.getElementById("lastPage").parentElement.classList.add("disabled")
          document.getElementById("firstPage").parentElement.classList.remove("disabled")
          
        } else {
          document.getElementById("lastPage").parentElement.classList.remove("disabled")
          document.getElementById("firstPage").parentElement.classList.remove("disabled")
          
        }
        
      this.searchResultsChange.emit(this.searchResults)
    }
}
