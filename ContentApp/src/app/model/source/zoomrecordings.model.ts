/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */
export interface Recording {
  deleted_time: string;
  download_url: string;
  file_path: string;
  file_size: number;
  file_type: string;
  file_extension: string;
  id: string;
  meeting_id: string;
  play_url: string;
  recording_end: string;
  recording_start: string;
  recording_type: string;
  status: string;
}

export interface Meeting {
  account_id: string;
  duration: number;
  host_id: string;
  id: number;
  recording_count: number;
  start_time: string;
  topic: string;
  total_size: number;
  type: string;
  uuid: string;
  recording_play_passcode: string;
  recording_files: Recording[];
}

export interface ZoomRecordings {
  from: string;
  to: string;
  next_page_token: string;
  page_count: number;
  page_size: number;
  total_records: number;
  meetings: Meeting[];
}
