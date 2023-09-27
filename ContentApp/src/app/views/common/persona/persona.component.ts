import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { MessengerService } from 'src/app/service/messenger.service';
import { SettingsService } from 'src/app/service/settings.service';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  aiForm: FormGroup;

  activeIndex: number = 0;
  isLoading = false;

  items: MenuItem[] = [
    {
        label: 'Who are you?',
        // command: (event: any) => this.messageService.add({severity:'info', summary:'First Step', detail: event.item.label})
    },
    {
        label: 'Who do you help?',
        // command: (event: any) => this.messageService.add({severity:'info', summary:'Second Step', detail: event.item.label})
    },
    {
        label: 'How do you serve?',
        // command: (event: any) => this.messageService.add({severity:'info', summary:'Third Step', detail: event.item.label})
    }
  ];

  constructor(
    private fb: FormBuilder,
    private messengerService: MessengerService,
    private settingsService: SettingsService
  ) {
    this.aiForm = this.fb.group({
      persona: [''],
      values: [''],
      audience: [''],
      context: [''],
      style: [''],
      voice: ['']
    });
  }

  ngOnInit(): void {
    this.settingsService.errorObservable$.subscribe({
      next: (error) => {
        this.messengerService.setErrorMessage(error);
      }
    });
    this.settingsService.loadingObservable$.subscribe({
      next: (loadingState) => {
        this.isLoading = loadingState;
      }
    });
    this.settingsService.personaObservable$.subscribe({
      next: (persona) => {
        if (persona !== undefined) {
          this.aiForm.patchValue({
            persona: persona.persona,
            values: persona.values,
            audience: persona.audience,
            context: persona.context,
            style: persona.style,
            voice: persona.voice
          });
        } else {
          this.messengerService.setErrorMessage('There was an error saving your AI persona.');
        }
      }
    });            
    this.settingsService.getPersonaSettings();
  }

  onSaveAI() {
    this.settingsService.storePersonaSettings(
      this.aiForm.value.persona,
      this.aiForm.value.audience,
      this.aiForm.value.style,
      this.aiForm.value.values,
      this.aiForm.value.voice, 
      this.aiForm.value.context,
    ).subscribe({
      next:(response) => {
        if (response !== undefined) {
          if (this.activeIndex < 2) {
            this.activeIndex++;
          } else if (this.activeIndex === 2) { 
            this.messengerService.setInfoMessage('AI Persona settings saved!');
          }
        }
      }
    })
  }

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }
}
