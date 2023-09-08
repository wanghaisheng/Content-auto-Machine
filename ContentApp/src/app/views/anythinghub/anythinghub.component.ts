/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Generators } from 'src/app/model/response/generators.model'
import { HubDashboardService } from 'src/app/service/hubdashboard.service';
import { NavigationService } from 'src/app/service/navigation.service';

@Component({
  selector: 'app-anythinghub',
  templateUrl: './anythinghub.component.html',
  styleUrls: ['./anythinghub.component.css']
})
export class AnythinghubComponent implements OnInit, AfterContentInit {

  // blockMode: boolean = false;
  generatorsList: {
    header: string;
    items: {
      type: string;
      title: string;
      description: string;
      prompt: string;
    }[];
  }[] = [];

  constructor(
    private navigationService: NavigationService,
    private hubDashboardService: HubDashboardService
  ) { }

  ngOnInit(): void {
    this.hubDashboardService.generatorsListObservable$.subscribe((genrators: {
      header: string;
      items: {
        type: string;
        title: string;
        description: string;
        prompt: string;
      }[];
    }[]) => {
        this.generatorsList = genrators;
      }
    )
    this.hubDashboardService.errorObservable$.subscribe((error: string) => {
      console.log(error);
    });
  }

  ngAfterContentInit(): void {
    // this.blockMode = true;
    this.hubDashboardService.getHubGenerators();
  }
  
  itemClick(generator_type: string) {
    this.navigationService.navigateToDashboard(generator_type)
  }
}
