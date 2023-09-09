/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

export interface FacebookPage {
  access_token: string,
  category: string,
  category_list: [
    {
      id: string,
      name: string
    }
  ],
  name: string,
  id: string,
  tasks: string[]
}
