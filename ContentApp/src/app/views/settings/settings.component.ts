import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { SocialAuthService } from 'src/app/service/user/socialauth.service';
import { ZOOM_CLIENT_ID } from 'appsecrets';
import { MessengerService } from 'src/app/service/messenger.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { NavigationService } from 'src/app/service/navigation.service';
import { FacebookPage } from 'src/app/model/content/facebookpage.model';
import { Panel } from 'primeng/panel';
import { Menu } from 'primeng/menu';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SettingsService } from 'src/app/service/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements AfterViewInit{
  
  @Input() parentFocusedConnection = 0;

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

  currentView = 'Your AI';
  menuItems: MenuItem[] = [
    {
      label: 'Personal',
      items: [
        {
          label: 'Your AI',
          icon: 'pi pi-android',
          command: () => {
            this.isBlocked = false;
            this.currentView = 'Your AI';
          }
        },
        {
          label: 'Profile',
          icon: 'pi pi-user',
          command: () => {
            this.isBlocked = false;
            this.currentView = 'Profile';
          }
        }
      ]
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

  profileForm: FormGroup;
  aiForm: FormGroup;

  @ViewChild('pnl', {static: false}) paneler?: ElementRef<Panel>;
  @ViewChild('menu', {static: false}) menu?: Menu;

  constructor(
    private confirmationService: ConfirmationService,
    private messengerService: MessengerService,
    private navigationService: NavigationService,
    private socialAuthService: SocialAuthService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private settingsService: SettingsService,
  ) {
    this.profileForm = this.formBuilder.group({
      name: [''],
      email: [''],
    });
    this.aiForm = this.formBuilder.group({
      persona: [''],
      audience: [''],
      style: [''],
      values: [''],
      voice: [''],
      character: [''],
    });
  }

  ngOnInit(): void {
    this.setupObservers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parentFocusedConnection']) {
      if (changes['parentFocusedConnection'].currentValue === 1) {
        this.facebookAuthMenuItemIndex = 1;
        //TODO not optimal because we create a new object each time
        this.socialAuthService.facebookPagesObservable$.subscribe({
          next: (pages) => {
            this.userFacebookPages = pages;
          },
        });
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
    this.socialAuthService.userSocialAccountsObservable$.subscribe({
      next: (accounts) => {
        console.log("🚀 ~ file: settings.component.ts:176 ~ SettingsComponent ~ setupObservers ~ accounts:", accounts)
        this.isAccountsLoading = false;
        accounts.forEach((account) => {
          this.zoomConnected = account['zoom'];
          this.facebookConnected = account['facebook'];
          this.linkedinConnected = account['linkedin'];
          this.mediumConnected = account['medium'];
          this.youtubeConnected = account['youtube'];
          this.twitterConnected = account['twitter'];
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
    this.socialAuthService.youtubeAuthObservable$.subscribe({
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
    this.settingsService.errorObservable$.subscribe({
      next: (error) => {
        this.messageService.add({
          severity: 'danger',
          summary: 'Opps! Sorry about that.',
          detail: `${error}`,
        });
      }
    });
    this.settingsService.loadingObservable$.subscribe({
      next: (isLoading) => {
        this.isLoading = isLoading;
      }
    });
    this.settingsService.personaObservable$.subscribe({
      next: (persona) => {
        if (persona !== undefined) {
          this.aiForm.patchValue({
            persona: persona.persona,
            audience: persona.audience,
            style: persona.style,
            values: persona.values,
            voice: persona.voice,
            character: persona.character,
          });
        } else {
          this.messengerService.setErrorMessage('There was an error saving your AI persona.');
        }
      }
    });
    // KICKOFF COMMANDS
    this.settingsService.getPersonaSettings();
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
    // this.socialAuthService.signInWithTwitter();
  }

  onYoutubeLogin() {
    this.socialAuthService.signInWithYoutube();
  }

  onLinkedinLogin() {
    const linkedInCredentials = this.socialAuthService.getLinkedInCredentials();
    window.location.href = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${linkedInCredentials.client_id}&redirect_uri=${linkedInCredentials.redirect_uri}&scope=${linkedInCredentials.scope}`;
  }

  onMediumSubmit() {
    // this.socialAuthService.signInWithMedium(this.mediumIntegKey);
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

  onLogoutClick() {
    this.confirmationService.confirm({
      message:
        'You are about to log out of the app.  Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messengerService.setInfoMessage('You have been logged out.');
        this.navigationService.navigateToLogin();
      },
      reject: (type: any) => { /** */ },
    });
  }

  onSaveAI() {
    this.settingsService.storePersonaSettings(
      this.aiForm.value.persona,
      this.aiForm.value.audience,
      this.aiForm.value.style,
      this.aiForm.value.values,
      this.aiForm.value.voice, 
      this.aiForm.value.character,
    ).subscribe({
      next:(response) => {
        if (response !== undefined) {
          this.messengerService.setInfoMessage('AI Persona settings saved!');
        }
      }
    })
  }
}
