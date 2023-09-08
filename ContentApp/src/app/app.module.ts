/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HammerModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { LoginComponent } from './views/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from 'environments/environment';
import { ConfirmationDialogComponent } from './views/common/confirmationdialog.component';
import { CalendarComponent } from './views/calendar/calendar.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { firebase, firebaseui, FirebaseUIModule } from 'firebaseui-angular';
import { HomeComponent } from './views/home/home.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { MenubarModule } from 'primeng/menubar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { TabViewModule } from 'primeng/tabview';
import { AccounthubComponent } from './views/accounthub/accounthub.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LinkedinRedirectComponent } from './views/redirects/linkedinredirect.component';
import { FacebookRedirectComponent } from './views/redirects/facebookredirect.component';
import { ZoomRedirectComponent } from './views/redirects/zoomredirect.component';
import { SplitterModule } from 'primeng/splitter';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AccordionModule } from 'primeng/accordion';
import { CreateContentComponent } from './views/createcontent/createcontent.component';
import { StepsModule } from 'primeng/steps';
import { ListboxModule } from 'primeng/listbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';
import { BlockUIModule } from 'primeng/blockui';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { AnythinghubComponent } from './views/anythinghub/anythinghub.component';
import { ContentDashboardComponent } from './views/contentdashboard/contentdashboard.component';
import { CreatepanelComponent } from './views/contentdashboard/createpanel/createpanel.component';
import { ContentpanelComponent } from './views/contentdashboard/contentpanel/contentpanel.component';
import { SettingsComponent } from './views/settings/settings.component';

firebase.initializeApp(environment.firebaseConfig);

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    {
      requireDisplayName: false,
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    },
  ],
  tosUrl: '<your-tos-link>',
  privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ConfirmationDialogComponent,
    CalendarComponent,
    PageNotFoundComponent,
    HomeComponent,
    AccounthubComponent,
    LinkedinRedirectComponent,
    FacebookRedirectComponent,
    CreateContentComponent,
    AnythinghubComponent,
    ContentDashboardComponent,
    CreatepanelComponent,
    ContentpanelComponent,
    SettingsComponent
  ],
  imports: [
    SplitButtonModule,
    SkeletonModule,
    BlockUIModule,
    TooltipModule,
    ImageModule,
    BreadcrumbModule,
    SelectButtonModule,
    DropdownModule,
    InputTextareaModule,
    ListboxModule,
    StepsModule,
    AccordionModule,
    ToastModule,
    ConfirmDialogModule,
    SplitterModule,
    InputTextModule,
    ProgressSpinnerModule,
    TabViewModule,
    DividerModule,
    ScrollPanelModule,
    PanelModule,
    MenubarModule,
    DialogModule,
    ButtonModule,
    CardModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HammerModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
  ],
  providers: [
    ConfirmationService, 
    MessageService,
    DialogService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
