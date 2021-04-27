import { Input, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { SignUp } from './User Profile/sign-up/sign-up.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { Login } from './User Profile/login-user-form/login.component';
import { LogoutUserComponent } from './User Profile/logout-user/logout-user.component';
import { HomepageComponent } from './homepage/homepage.component';
import { CybersAllComponent } from './Cyber/cybers-all/cybers-all.component';
import { CyberDetailsComponent } from './Cyber/cyber-details/cyber-details.component';
import { SlideshowComponent } from './User Profile/slideshow/slideshow.component';
import { AddCyberFormComponent } from './Cyber/add-cyber-form/add-cyber-form.component';
import { DeleteCyberComponent } from './Cyber/delete-cyber/delete-cyber.component';
import { ProfilesComponent } from './User Profile/profiles/profiles.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ChangeProfilePictureComponent } from './change-profile-picture/change-profile-picture.component';
import { EditProfileInfoComponent } from './User Profile/edit-profile-info/edit-profile-info.component';
import { DeleteUserModalComponent } from './User Profile/delete-user-modal/delete-user-modal.component';
import { EditCyberInfoComponent } from './Cyber/edit-cyber-info/edit-cyber-info.component';
import { AddCyberEventComponent } from './Event/add-cyber-event/add-cyber-event.component';
import { EventsAllComponent } from './Event/events-all/events-all.component';
import { EditCyberEventComponent } from './Event/edit-cyber-event/edit-cyber-event.component';
import { EventDetailsComponent } from './Event/event-details/event-details.component';
import { SearchComponentComponent } from './search-component/search-component.component';
import { CreateArticlesComponent } from './Articles/create-articles-component/create-articles.component';
import { ArticleComponent } from './Articles/article/article.component';
import { AllArticlesComponent } from './Articles/all-articles/all-articles.component';
import { EditArticleComponent } from './Articles/edit-article/edit-article.component';
import { HomepageMainComponent } from './homepage-main/homepage-main.component';
import { ResetPasswordRequestComponent } from './User Profile/reset-password-request/reset-password-request.component';
import { CompletePasswordResetComponent } from './User Profile/complete-password-reset/complete-password-reset.component';
import { LoadingWidgetComponent } from './loading-widget/loading-widget.component';
import { PaginationComponentComponent } from './pagination-component/pagination-component.component';
import { AppSlideshowComponent } from './app-slideshow/app-slideshow.component';
import { FooterComponent } from './footer/footer.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { KnowYourContentCreatorArticlesComponent } from './Articles/know-your-content-creator-articles/know-your-content-creator-articles.component';
const routes: Routes = [
    { path: '', component: NavBarComponent , outlet:'nav-bar' },
    { path: '', component: HomepageComponent },
    { path: '', component: FooterComponent , outlet:'footer' },
    { path: 'sign-up', component: SignUp , data: {animation: 'SignUpPage'} },
      { path: 'log-in', component: Login , data: {animation: 'LogInPage'} },
      { path: 'log-out' , component: LogoutUserComponent },
      { path: 'places-all' , component: CybersAllComponent },
      { path: 'place-details/:id', component: CyberDetailsComponent },
      { path: 'add-cyber', component: AddCyberFormComponent},
      { path: 'profiles/:id', component: ProfilesComponent},
      { path: 'edit-profile-info/:id', component: EditProfileInfoComponent},
      { path: 'edit-cyber-info/:id', component: EditCyberInfoComponent},
      { path: 'add-cyber-logo/:id/:token', component: ChangeProfilePictureComponent},
      { path: 'add-cyber-event/:id', component: AddCyberEventComponent},
      { path: 'events-all', component: EventsAllComponent},
      { path: 'edit-cyber-event/:id', component: EditCyberEventComponent},
      { path: 'event-details/:id', component: EventDetailsComponent},
      { path: 'search', component: SearchComponentComponent},
      { path: 'create-article', component: CreateArticlesComponent},
      { path: 'articles/:id', component: ArticleComponent},
      { path: 'all-articles', component: AllArticlesComponent},
      { path: 'know-your-content-creator-articles', component: KnowYourContentCreatorArticlesComponent},
      { path: 'edit-article/:id', component: EditArticleComponent},
      { path: 'homepage', component: HomepageMainComponent},
      { path: 'reset-password', component: ResetPasswordRequestComponent},
      { path: 'complete-password-reset/:id', component: CompletePasswordResetComponent},
      { path: '**', component: NotFoundPageComponent }
  
  ];

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
    @Input() token: string;
    ngOnInit(): void {
    }
    
 }