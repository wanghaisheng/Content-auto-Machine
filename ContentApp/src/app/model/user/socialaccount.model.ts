/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

export interface SocialAccount {
  platform: string;
  handle?: string;
  user_id?: string;
  access_token: string;
  last_login_at?: string;
  creation_time?: string;
  refresh_token?: string;
  scopes?: string[];
  hasError?: boolean;
}
