import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { Routes, RouterModule } from '@angular/router';





import { ReactiveFormsModule,FormsModule } from '@angular/forms';

import { SignUp } from './User Profile/sign-up/sign-up.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatTabsModule} from '@angular/material/tabs';


import { HttpClientModule } from '@angular/common/http';
import { Login } from './User Profile/login-user-form/login.component';


import { CookieService } from 'ngx-cookie-service';
import { LogoutUserComponent } from './User Profile/logout-user/logout-user.component';
import { HomepageComponent } from './homepage/homepage.component';
import { CybersAllComponent } from './Cyber/cybers-all/cybers-all.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CyberDetailsComponent } from './Cyber/cyber-details/cyber-details.component';

import { SlideshowComponent } from './User Profile/slideshow/slideshow.component';
import { AddCyberFormComponent } from './Cyber/add-cyber-form/add-cyber-form.component';
import { MatCarouselModule } from '@ngbmodule/material-carousel';

import { DeleteCyberComponent } from './Cyber/delete-cyber/delete-cyber.component';


import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ProfilesComponent } from './User Profile/profiles/profiles.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ChangeProfilePictureComponent } from './change-profile-picture/change-profile-picture.component';
import { EditProfileInfoComponent } from './User Profile/edit-profile-info/edit-profile-info.component';
import { DeleteUserModalComponent } from './User Profile/delete-user-modal/delete-user-modal.component';
import { EditCyberInfoComponent } from './Cyber/edit-cyber-info/edit-cyber-info.component';
import { AddCyberEventComponent } from './Event/add-cyber-event/add-cyber-event.component';
import { EventsAllComponent } from './Event/events-all/events-all.component';

import {AngularFittextModule} from 'angular-fittext';

// import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
// import { fas } from '@fortawesome/free-solid-svg-icons';
import { EditCyberEventComponent } from './Event/edit-cyber-event/edit-cyber-event.component';
import { EventDetailsComponent } from './Event/event-details/event-details.component';
import { SearchComponentComponent } from './search-component/search-component.component';

// import { far } from '@fortawesome/free-regular-svg-icons';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CreateArticlesComponent } from './Articles/create-articles-component/create-articles.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { ArticleComponent } from './Articles/article/article.component';
import { AllArticlesComponent } from './Articles/all-articles/all-articles.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { EditArticleComponent } from './Articles/edit-article/edit-article.component';
import { HomepageMainComponent } from './homepage-main/homepage-main.component';
import { FooterComponent } from './footer/footer.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { ResetPasswordRequestComponent } from './User Profile/reset-password-request/reset-password-request.component';
import { CompletePasswordResetComponent } from './User Profile/complete-password-reset/complete-password-reset.component';
import { LoadingWidgetComponent } from './loading-widget/loading-widget.component';
// import { far } from '@fortawesome/free-regular-svg-icons';
import {MatMenuModule} from '@angular/material/menu';
import { PaginationComponentComponent } from './pagination-component/pagination-component.component';
import { AppSlideshowComponent } from './app-slideshow/app-slideshow.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { SignUpOrLoginToRateComponent } from './sign-up-or-login-to-rate/sign-up-or-login-to-rate.component';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';
import { ShareModule } from 'ngx-sharebuttons';
import { KnowYourContentCreatorArticlesComponent } from './Articles/know-your-content-creator-articles/know-your-content-creator-articles.component';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  declarations: [
    AppComponent,
    SignUp,
    NavBarComponent,
    Login,
    LogoutUserComponent,
    HomepageComponent,
    CybersAllComponent,
    CyberDetailsComponent,
    SlideshowComponent,
    AddCyberFormComponent,
    DeleteCyberComponent,
    ProfilesComponent,
    ImageUploadComponent,
    ChangeProfilePictureComponent,
    EditProfileInfoComponent,
    DeleteUserModalComponent,
    EditCyberInfoComponent,
    AddCyberEventComponent,
    EventsAllComponent,
    EditCyberEventComponent,
    EventDetailsComponent,
    SearchComponentComponent,
    CreateArticlesComponent,
    ArticleComponent,
    AllArticlesComponent,
    EditArticleComponent,
    HomepageMainComponent,
    FooterComponent,
    ResetPasswordRequestComponent,
    CompletePasswordResetComponent,
    LoadingWidgetComponent,
    PaginationComponentComponent,
    AppSlideshowComponent,
    NotFoundPageComponent,
    SignUpOrLoginToRateComponent,
    KnowYourContentCreatorArticlesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    AppRoutingModule,
    MatProgressSpinnerModule,
    // FontAwesomeModule,
    // FaIconLibrary,
    NgbModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatCarouselModule.forRoot(),
    MatDialogModule,
    MatSnackBarModule,
    AngularFittextModule,   
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    MatPaginatorModule,
    FontAwesomeModule,
    MatMenuModule,
    MatSelectModule,
    SocialLoginModule,
    ShareModule,
    MatExpansionModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    MatSlideToggleModule
  ],
  exports: [RouterModule],
  providers: [
    CookieService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              'clientId'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('clientId')
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIconPacks(fas);
  }
}



