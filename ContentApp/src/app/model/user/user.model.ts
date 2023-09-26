import { Content } from "../content/content.model";
import { SocialAccount } from "./socialaccount.model";

export interface FirebaseUser {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: string;
  lastLogin?: string;
  creationTime?: string;
  lastRefreshAt?: string;
  idToken?: string;
  isFirstTimeUser?: boolean;

  content?: Content[];
  socialAccounts?: SocialAccount[];
}
