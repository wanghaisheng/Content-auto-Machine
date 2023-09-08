/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */
export interface ZoomUser {
  id: string,
  first_name: string,
  last_name: string,
  email: string,
  type: number,
  role_name: string,
  pmi: number,
  use_pmi: boolean,
  vanity_url: string,
  personal_meeting_url: string,
  timezone: string,
  verified: number,
  dept: string,
  created_at: string,
  last_login_time: string,
  last_client_version: string,
  pic_url: string,
  host_key: string,
  jid: string,
  group_ids: [],
  im_group_ids: string[],
  account_id: string,
  language: string,
  phone_country: string,
  phone_number: string,
  status: string
}
