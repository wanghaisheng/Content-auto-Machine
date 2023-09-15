import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { HubDashboardService } from 'src/app/service/hubdashboard.service';
import { SocialAuthService } from 'src/app/service/user/socialauth.service';
import { ZOOM_CLIENT_ID } from 'appsecrets';
import { MessengerService } from 'src/app/service/messenger.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { NavigationService } from 'src/app/service/navigation.service';
import { SocialAccount } from 'src/app/model/user/socialaccount.model';
import { FacebookPage } from 'src/app/model/content/facebookpage.model';
import { Panel } from 'primeng/panel';
import { Menu } from 'primeng/menu';
import { PostingPlatform } from 'src/app/constants';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements AfterViewInit{
  
  @Input() parentFocusedConnection = 0;

  personalAccounts: SocialAccount[] = [];

  isAccountsLoading = true;
  isLoading = false;
  isBlocked = false;

  zoomConnected = false;
  twitterConnected = false;
  youtubeConnected = false;
  linkedinConnected = false;
  facebookConnected = false;
  mediumConnected = false;

  mediumIntegKey = '';

  faceebookAuthMenuItems: MenuItem[] = [
    {
      label: 'Facebook Login',
    },
    {
      label: 'Select Page',
    },
    {
      label: 'Select Instagram',
    },
  ];
  facebookAuthMenuItemIndex = 0;
  userFacebookPages: FacebookPage[] = [];
  userSelectedFacebookPage: FacebookPage | undefined = undefined;

  currentView = 'Profile';
  menuItems: MenuItem[] = [
    {
      label: 'Personal',
      items: [
        {
          label: 'Profile',
          icon: 'pi pi-user',
          command: () => {
            this.isBlocked = false;
            this.currentView = 'Profile';
          },
        },
        {
          label: 'Your AI',
          icon: 'pi pi-android',
          command: () => {
            this.isBlocked = false;
            this.currentView = 'Your AI';
          },
        },
      ],
    },
    {
      label: 'Social Accounts',
      items: [
        {
          label: 'Zoom',
          icon: 'pi pi-video',
          command: () => {
            this.isBlocked = false;
            this.currentView = 'Zoom';
          },
        },
        {
          label: 'Facebook',
          icon: 'pi pi-facebook',
          command: () => {
            this.isBlocked = true;
            this.currentView = 'Facebook';
          },
        },
        {
          label: 'LinkedIn',
          icon: 'pi pi-linkedin',
          command: () => {
            this.isBlocked = true;
            this.currentView = 'LinkedIn';
          },
        },
        {
          label: 'Twitter',
          icon: 'pi pi-twitter',
          command: () => {
            this.isBlocked = true;
            this.currentView = 'Twitter';
          },
        },
        {
          label: 'Email',
          icon: 'pi pi-send',
          command: () => {
            this.currentView = 'Email';
            this.isBlocked = true;
          },
        },
      ],
    },
  ];

  @ViewChild('pnl', {static: false}) paneler?: ElementRef<Panel>;
  @ViewChild('menu', {static: false}) menu?: Menu;

  constructor(
    private confirmationService: ConfirmationService,
    private messengerService: MessengerService,
    private navigationService: NavigationService,
    private socialAuthService: SocialAuthService,
    private messageService: MessageService
  ) {
    /** */
  }

  ngOnInit(): void {
    this.setupObservers();
    this.socialAuthService.getAuthenticatedPersonalAccts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parentFocusedConnection']) {
      if (changes['parentFocusedConnection'].currentValue === 1) {
        this.facebookAuthMenuItemIndex = 1;
        this.socialAuthService.getFacebookPages();
      }
    }
  }

  ngAfterViewInit(): void {
    this.menu?.hide();
  }

  private setupObservers() {
    this.socialAuthService.getInstagramLinkSuccessObservable$.subscribe({
      next: (success) => {
        this.facebookAuthMenuItemIndex = 2;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err,
        });
      },
    });
    this.socialAuthService.getFacebookPagesObservable$.subscribe({
      next: (pages) => {
        this.userFacebookPages = pages;
      },
    });
    this.socialAuthService.getPersonalAccountsObservable$.subscribe({
      next: (accounts) => {
        this.isAccountsLoading = false;
        this.personalAccounts = accounts;
        this.personalAccounts.forEach((account) => {
          // we should only label as connected if a FB page and IG is connected
          if (account.platform === PostingPlatform.FACEBOOK) {
            this.facebookConnected = true;
          } else if (account.platform === PostingPlatform.LINKEDIN) {
            this.linkedinConnected = true;
          } else if (account.platform === PostingPlatform.MEDIUM) {
            this.mediumConnected = true;
          } else if (account.platform === PostingPlatform.YOUTUBE) {
            this.youtubeConnected = true;
          } else if (account.platform === PostingPlatform.TWITTER) {
            this.twitterConnected = true;
          } 
        });
      },
      error: (error) => {
        this.isAccountsLoading = false;
        this.messageService.add({
          severity: 'danger',
          summary: 'Opps! Sorry about that.',
          detail: `${error}`,
        });
      },
    });
    this.socialAuthService.getYoutubeAuthObservable$.subscribe({
      next: (isConnected) => {
        this.youtubeConnected = isConnected;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'danger',
          summary: 'Opps! Sorry about that.',
          detail: `${error}`,
        });
      },
    });
    this.socialAuthService.getTwitterAuthObservable$.subscribe(
      (isConnected) => {
        this.twitterConnected = isConnected;
      }
    );
    this.socialAuthService.getConnectionLoadingObservable$.subscribe(
      (isLoading) => {
        this.isLoading = isLoading;
      }
    );
    this.socialAuthService.getErrorObservable$.subscribe((error) => {
      this.messageService.add({
        severity: 'danger',
        summary: 'Opps! Sorry about that.',
        detail: `${error}`,
      });
    });
    this.socialAuthService.getMediumAuthObservable$.subscribe((isConnected) => {
      this.mediumConnected = isConnected;
    });
  }

  onFacebookLogin() {
    // this.socialAuthService.signInWithFacebook();
    const params = {
      client_id: '883874189493049',
      redirect_uri: 'http://localhost:4200/facebook-callback',
      facebookScope: 'email',
    };

    window.location.href = `https://www.facebook.com/v15.0/dialog/oauth?client_id=${params.client_id}&redirect_uri=${params.redirect_uri}&scope=${params.facebookScope}`;
  }

  onTwitterLogin() {
    this.socialAuthService.signInWithTwitter();
  }

  onYoutubeLogin() {
    this.socialAuthService.signInWithYoutube();
  }

  onLinkedinLogin() {
    const linkedInCredentials = this.socialAuthService.getLinkedInCredentials();
    window.location.href = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${linkedInCredentials.client_id}&redirect_uri=${linkedInCredentials.redirect_uri}&scope=${linkedInCredentials.scope}`;
  }

  onMediumSubmit() {
    this.socialAuthService.signInWithMedium(this.mediumIntegKey);
  }

  onFacebookPageSelected() {
    if (this.userSelectedFacebookPage !== undefined) {
      this.socialAuthService.getAssociatedInstagramAccounts(
        this.userSelectedFacebookPage
      );
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Please select a page before continuing',
        detail: `Please select a page.`,
      });
    }
  }

  onZoomLogin() {
    const params = {
      //TODO: move to appsecrets
      client_id: ZOOM_CLIENT_ID,
      redirect_uri: 'http://localhost:4200/zoom-callback',
    };
    window.location.href = `https://zoom.us/oauth/authorize?response_type=code&client_id=${params.client_id}&redirect_uri=${params.redirect_uri}`;
  }

  onAccountClick() {
    this.confirmationService.confirm({
      message:
        'You are about to log out of the app.  Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messengerService.setInfoMessage('You have been logged out.');
        this.navigationService.navigateToLogin();
      },
      reject: (type: any) => {
        // switch (type) {
        //     case ConfirmEventType.REJECT:
        //         this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
        //         break;
        //     case ConfirmEventType.CANCEL:
        //         this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
        //         break;
        // }
      },
    });
  }

  onProfileSaved() {

  }
}
