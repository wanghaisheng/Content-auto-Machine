import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessengerService } from 'src/app/service/messenger.service';
import { SettingsService } from 'src/app/service/settings.service';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  aiForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private messengerService: MessengerService,
    private settingsService: SettingsService
  ) {
    this.aiForm = this.fb.group({
      persona: [''],
      audience: [''],
      style: [''],
      values: [''],
      voice: [''],
      character: [''],
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
    this.settingsService.getPersonaSettings();
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
