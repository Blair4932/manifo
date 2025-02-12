import { APP_VERSION } from "./version";

interface UpdateMessage {
  version: string;
  date: string;
  title: string;
  content: string;
  contentInDepth?: string;
}

// This should be changed on each commit
export const updateMessage: UpdateMessage = {
  version: APP_VERSION,
  // UPDATE THIS
  date: "9 Feb 2025",
  // UPDATE THIS
  title: "Forgetful? We got you!",
  // UPDATE THIS
  content:
    "Hello Manifonians, We've got a new update! You can now change your account information, and reset your password if you forget it. If you notice any issues please get in contact",
};
