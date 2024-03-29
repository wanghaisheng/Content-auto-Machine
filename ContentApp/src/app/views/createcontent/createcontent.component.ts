/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SchedulingService } from 'src/app/service/scheduling.service';

@Component({
  selector: 'app-createcontent',
  templateUrl: './createcontent.component.html',
  styleUrls: ['./createcontent.component.css'],
})
export class CreateContentComponent implements OnInit {
  private contentCreationStage = {
    INIT: 'init',
    TEXT: 'text',
    VIDEO: 'video',
    YT_LINK: 'youtube_link',
    LOADING: 'loading',
  };
  currentContentStage = this.contentCreationStage.INIT;

  inputPrompt: string = '';
  imagePrompt: string = '';

  frequencyOptions: any[] = [
    { title: 'Passive', description: 'Every day', value: 'passive' },
    { title: 'Professional', description: 'Every week', value: 'professional' },
    { title: 'Aggressive', description: 'Every month', value: 'aggressive' },
  ];
  selectedFrequency?: { title: string; desctipion: string; value: string };

  constructor(
    private contentService: SchedulingService,
    private messageService: MessageService
  ) {
    /** */
  }

  ngOnInit(): void {
    this.currentContentStage = this.contentCreationStage.INIT;
  }

  onCreateSelected(selectedOption: any) {
    if (selectedOption === undefined) {
      this.messageService.add({
        severity: 'warning',
        summary: 'Something Is Missing',
        detail: 'Please select a frequency',
      });
      return;
    }
    this.contentService.createContent(
      this.inputPrompt,
      this.imagePrompt,
      selectedOption
    );
    this.currentContentStage = this.contentCreationStage.LOADING;
  }

  generateWithText() {
    this.currentContentStage = this.contentCreationStage.TEXT;
  }
  generateWithVideo() {
    this.currentContentStage = this.contentCreationStage.VIDEO;
  }
  generateWithYoutube() {
    this.currentContentStage = this.contentCreationStage.YT_LINK;
  }
  onAutoGenerate() {
    throw new Error('Method not implemented.');
  }
  onAutoGenerateTopic() {
    throw new Error('Method not implemented.');
  }
}
