import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CommunityService } from '../../etakstart.service';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { SimpleChange } from '@angular/core';
import "froala-editor/js/plugins/align.min.js";
import "froala-editor/js/plugins/char_counter.min.js";
import "froala-editor/js/plugins/code_beautifier.min.js";
import "froala-editor/js/plugins/code_view.min.js";
import "froala-editor/js/plugins/colors.min.js";
import "froala-editor/js/plugins/draggable.min.js";
import "froala-editor/js/plugins/emoticons.min.js";
import "froala-editor/js/plugins/file.min.js";
import "froala-editor/js/plugins/font_size.min.js";
import "froala-editor/js/plugins/fullscreen.min.js";
import "froala-editor/js/plugins/image.min.js";
import "froala-editor/js/plugins/image_manager.min.js";
import "froala-editor/js/third_party/image_tui.min.js";
import "froala-editor/js/plugins/inline_class.min.js";
import "froala-editor/js/plugins/line_breaker.min.js";
import "froala-editor/js/plugins/link.min.js";
import "froala-editor/js/plugins/lists.min.js";
import "froala-editor/js/plugins/paragraph_style.min.js";
import "froala-editor/js/plugins/paragraph_format.min.js"
import "froala-editor/js/plugins/print.min.js";
import "froala-editor/js/plugins/quick_insert.min.js";
import "froala-editor/js/plugins/quote.min.js";
import "froala-editor/js/plugins/table.min.js";
import "froala-editor/js/plugins/url.min.js";
import "froala-editor/js/plugins/video.min.js";
import "froala-editor/js/plugins/word_paste.min.js";
import {state} from '../../etakstart.service';
@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.css']
})
export class EditArticleComponent implements OnInit {
  token = this.cookieService.get('etak-start-token') || '';
  userObjEditArticle: any;
  Article = {
    pk: "",
    fields: {
      inner_content: "",
      user: [],
      headline:"",
      intro_text: "",
      article_cover: ""
    }
  };
  formData = new FormData();
  public options: Object;
  newImgLink: string;
  selectedCover: File= null;
  id: number;
  spinner = 0;
  constructor(private elRef:ElementRef,private route: ActivatedRoute,private communityService: CommunityService,public router: Router,private cookieService: CookieService,private _snackBar: MatSnackBar) { }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  ngOnInit(): void {
    if(!this.token ){
      this.router.navigate(['homepage']);
    } else {
      setTimeout(()=>{
        this.userObjEditArticle = this.communityService.getUserObj()
        if(this.userObjEditArticle.fields.is_admin === '0'){
          this.router.navigate(['homepage']);
        }
      },500)

      this.options = {
        placeholderText: 'Edit Your Content Here!',
        charCounterCount: false,
        toolbarButtons: 
          {
            'moreText': {
              'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting']
            },
            'moreParagraph': {
              'buttons': ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote']
            },
            'moreRich': {
              'buttons': ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertFile', 'insertHR']
            },
            'moreMisc': {
              'buttons': ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help'],
              'align': 'right',
              'buttonsVisible': 2
            }
          },
        // Set the image upload parameter.
    imageUploadParam: 'image_param',

    // Set the image upload URL.
    imageUploadURL: 'https://etak-start-api.herokuapp.com/upload-article-picture',
    imageRemoveURL: 'https://googleasd.com',

    // Additional upload params.
    imageUploadParams: {id: 'my_editor'},

    // Set request type.
    imageUploadMethod: 'POST',

    // Set max image size to 5MB.
    imageMaxSize: 5 * 1024 * 1024,

    // Allow to upload PNG and JPG.
    imageAllowedTypes: ['jpeg', 'jpg', 'png'],

    events: {
      'image.beforeUpload': function (images) {
        // Return false if you want to stop the image upload.
      },
      'image.uploaded': function (response) {
        let responseObj = JSON.parse(response)
        return responseObj.link
      },
      'image.inserted': function ($img, response) {
        // Image was inserted in the editor.
      },
      'image.removed': function ($img) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {

          // Image was removed.
          if (this.readyState == 4 && this.status == 200) {
          }
        };
        xhttp.open("POST", "https://etak-start-api.herokuapp.com/delete-article-picture", true);
        xhttp.send(JSON.stringify({
          src: $img.attr('src')
        }));
      },
      'image.replaced': function ($img, response) {
        // Image was replaced in the editor.
      },
      'image.error': function (error, response) {
        // Bad link.
        if (error.code == 1) { 
          
         }

        // No link in upload response.
        else if (error.code == 2) {
          
         }

        // Error during image upload.
        else if (error.code == 3) { 
          
         }

        // Parsing response failed.
        else if (error.code == 4) { 
          
         }

        // Image too text-large.
        else if (error.code == 5) { 
          
         }

        // Invalid image type.
        else if (error.code == 6) {
          
         }

        // Image can be uploaded only to same domain in IE 8 and IE 9.
        else if (error.code == 7) {
          
        }

        // Response contains the original server response to the request if available.
      }
    }
      }
      setTimeout(()=>{
        this.id = parseInt(this.router.url.replace("/edit-article/",""));
        let ArticleObj = state.Articles.filter(article=> article.pk === this.id)
        this.Article = ArticleObj[0]
        console.log(this.Article)
        let input = (document.getElementById("articleHeadline")) as HTMLInputElement;
        input.value =  this.Article.fields.headline;
        document.getElementById("articleIntro").textContent =  this.Article.fields.intro_text;
        document.getElementById("coverForArticle").setAttribute("src","https://etak-start.s3.eu-west-3.amazonaws.com/media/"+this.Article.fields.article_cover);
        document.getElementsByClassName("fr-element fr-view")[0].innerHTML = this.Article.fields.inner_content;
      },1000)
    }
    
    
  }
  ngOnChanges(change: SimpleChange): void{

  }
  onCoverSelected(event){
    this.selectedCover = event.target.files[0];
    document.getElementById("coverForArticle").setAttribute("src",URL.createObjectURL(this.selectedCover))
  }
  onClickChangeArticleCover(): void {
    document.getElementById("articleCoverId").click()
}
  onClickCreate(event){
    // 
    this.spinner = 1;
    let articleHeadlineElement = (document.getElementById("articleHeadline")) as HTMLInputElement;
    this.formData.append('headline', articleHeadlineElement.value);
    let articleIntro = (document.getElementById("articleIntro")) as HTMLTextAreaElement;
    this.formData.append('intro_text', articleIntro.value);
    let articleCategory = (document.getElementById("articleCategory")) as HTMLSelectElement;
    if((<HTMLInputElement>document.getElementById("coverForArticle")).src === '' && this.selectedCover === null){
      this.spinner = 0;
      this.openSnackBar("Please add a cover!","Ok");
    }else if((<HTMLInputElement>document.getElementById("coverForArticle")).src !== '' && (<HTMLInputElement>document.getElementById("articleHeadline")).value !== '' && (<HTMLInputElement>document.getElementById("articleIntro")).value !== '' ||this.selectedCover !== null) {
      if(this.selectedCover !== null){
        this.formData.append('article_cover',this.selectedCover,this.selectedCover.name)
      }
      this.formData.append('inner_content', document.getElementsByClassName("fr-element fr-view")[0].innerHTML);
      this.formData.append('category', articleCategory.value);
      this.formData.append('token', this.userObjEditArticle.fields.token);
      this.communityService.editArticle(this.formData,this.Article.pk,this.userObjEditArticle.pk).subscribe(data => {
        this.Article = data
        if(articleCategory.value === "General"){
          let newState = Object.assign({},state,{
            Articles: state.Articles.map(article=>{
              if(article.pk === data[0].pk){
                article = data[0]
                return article
              }
              return article
            })
            })
          this.communityService.changeState(newState);
        }else {
          let newState = Object.assign({},state,{
            KYCCArticles: state.KYCCArticles.map(article=>{
              if(article.pk === data[0].pk){
                article = data[0]
                return article
              }
              return article
            })
            })
          this.communityService.changeState(newState);
        }
        this.openSnackBar("Article Edited Successully","Ok");
        this.router.navigate(['/articles',data[0].pk])
      },error =>{
        this.spinner = 0;
        this.openSnackBar("An error has occurred","Ok");
      })
    } else {
      this.spinner = 0;
        this.openSnackBar("Please fill all required fields","Ok");
    }
  }
  onClickDeleteArticleBtn(event){
    this.spinner = 1;
    this.communityService.deleteArticle(this.Article.pk,this.userObjEditArticle.pk).subscribe(data => {
      this.openSnackBar("Article Deleted Successully","Ok");
      let articleCategory = (document.getElementById("articleCategory")) as HTMLSelectElement;
      if(articleCategory.value === "General"){
        let newState = Object.assign({},state,{
          Articles: state.Articles.filter(article=> article.pk !== this.Article.pk)
          })
        this.communityService.changeState(newState);
      }else {
        let newState = Object.assign({},state,{
          KYCCArticles: state.KYCCArticles.concat(data)
          })
        this.communityService.changeState(newState);
      }
      this.router.navigate(['/all-articles'])
    },error =>{
      this.spinner = 0;
      this.openSnackBar("An error has occured","Ok");
    })
  }
  ngOnDestroy(){
    
  }
}
