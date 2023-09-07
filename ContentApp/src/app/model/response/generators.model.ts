/*
 * Content Machine Complete
 * Version: 1.0.0
 * Author: Adrian Mohnacs
 * Copyright (c) 2023 Adrian Mohnacs
 * All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
 */

/**
 * The interface has an index signature for the outermost keys 
 * ([key: string]), which are dynamic.
 * The value for each dynamic key is another object with an 
 * index signature for the inner keys ([innerKey: string]).
 */
export interface Generators {
  [key: string]: {
    [innerKey: string]: {
      description: string;
      prompt: string;
      title: string;
    };
  };
}
