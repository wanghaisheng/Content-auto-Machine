from __future__ import unicode_literals

import sys
import os
from storage.firebase_firestore import firestore_instance

"""
Content Machine Complete
Version: 1.0.0
Author: Adrian Mohnacs
Copyright (c) 2023 Adrian Mohnacs
All rights reserved. Unauthorized copying or reproduction of this file is prohibited.
"""

# This code retrieves the current directory path and appends the '../src' directory to the sys.path, allowing access to modules in that directory.
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_dir, "../src"))

def get_all_user_posts( user_uuid ):
    posts = firestore_instance.get_all_posts(user_uuid)
    return posts
    