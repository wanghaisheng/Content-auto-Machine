/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { FireAuthRepository } from '../../repository/database/fireauth.repo';
import { map } from 'rxjs';
import { NavigationService } from '../navigation.service';

export const authGuard = (next: ActivatedRouteSnapshot) => {
  const sessionUserPresent = inject(FireAuthRepository).currentSessionUser !== undefined && inject(FireAuthRepository).currentSessionUser !== null;
  if (sessionUserPresent) {
    console.log("🚀 ~ file: auth.guard.ts:12 ~ authGuard ~ sessionUserPresent:", sessionUserPresent)
    return true;
  } else {
    const repo =  inject(FireAuthRepository).currentSessionUser;
    console.log("🚀 ~ file: auth.guard.ts:25 ~ authGuard ~ repo:", repo)
    if (repo !== undefined && repo !== null) {
      return true;
    } else {
      inject(NavigationService).navigateToLogin();
      return false;
    }
  }
};
