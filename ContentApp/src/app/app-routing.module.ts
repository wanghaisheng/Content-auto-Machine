import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { FacebookRedirectComponent } from './views/redirects/facebookredirect.component';
import { LinkedinRedirectComponent } from './views/redirects/linkedinredirect.component';
import { AnythinghubComponent } from './views/anythinghub/anythinghub.component';
import { ContentDashboardComponent } from './views/contentdashboard/contentdashboard.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'facebook-callback', component: FacebookRedirectComponent },
  { path: 'linkedin-callback', component: LinkedinRedirectComponent},
  { path: '', component: AnythinghubComponent},
  { path: 'dashboard', component: ContentDashboardComponent},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { /** */ }
