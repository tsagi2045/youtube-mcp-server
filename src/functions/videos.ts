import { google } from 'googleapis';

function safelyExecute<T>(fn: () => Promise<T>): Promise<T> {
  return fn().catch(error => {
    throw new Error(`Operation failed: ${error instanceof Error ? error.message : String(error)}`);
  });
}

export class VideoManagement {
  private youtube;

  constructor() {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      throw new Error('YOUTUBE_API_KEY environment variable is not set. Please set it before running the application.');
    }

    this.youtube = google.youtube({
      version: 'v3',
      auth: apiKey
    });
  }

  // ... rest of the code ...
}