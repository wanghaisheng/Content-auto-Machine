/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { FacebookRedirectComponent } from './views/redirects/facebookredirect.component';
import { LinkedinRedirectComponent } from './views/redirects/linkedinredirect.component';
import { AnythinghubComponent } from './views/anythinghub/anythinghub.component';
import { ContentDashboardComponent } from './views/contentdashboard/contentdashboard.component';
import { ZoomRedirectComponent } from './views/redirects/zoomredirect.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'facebook-callback', component: FacebookRedirectComponent },
  { path: 'linkedin-callback', component: LinkedinRedirectComponent},
  { path: 'zoom-callback', component: ZoomRedirectComponent},
  { 
    path: '', 
    component: AnythinghubComponent,
    data: { breadcrumb: 'Homebase' }
  },
  { 
    path: 'dashboard/:type', 
    component: ContentDashboardComponent,
    data: { breadcrumb: 'Dashboard' }
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { /** */ }
