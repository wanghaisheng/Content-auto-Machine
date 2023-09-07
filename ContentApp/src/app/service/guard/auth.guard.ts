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

export const authGuard = (next: ActivatedRouteSnapshot) => {
  const sessionUserPresent = inject(FireAuthRepository).currentSessionUser !== undefined && inject(FireAuthRepository).currentSessionUser !== null;
  if (sessionUserPresent) {
    console.log("🚀 ~ file: auth.guard.ts:12 ~ authGuard ~ sessionUserPresent:", sessionUserPresent)
    return true;
  } else {
    return inject(FireAuthRepository)
      .getUserAuthObservable()
      .pipe(
        map((user) => {
          console.log("🚀 ~ file: auth.guard.ts:19 ~ map ~ user:", user)
          if (!user) {
            console.log('🚀 ~ file: auth.guard.ts:11 ~ map ~ user:', user);
            inject(Router).navigate(['/lander']);
            return false;
          } else {
            console.log('🚀 ~ file: auth.guard.ts:15 ~ map ~ user:', user);
            return true;
          }
        })
      );
  }
};
