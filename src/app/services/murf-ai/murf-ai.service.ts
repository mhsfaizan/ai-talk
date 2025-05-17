import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MurfAiService {
  private httpClientService = inject(HttpClient);

  constructor() { }

  public convertToAudio(text: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = environment.MURF_API_URL;
      const headers = {
        'Content-Type': 'application/json',
        'api-key': environment.MURF_API_KEY
      };
      const payload = {
        text: text,
        voiceId: "en-IN-isha",
      };

      return this.httpClientService.post(url, JSON.stringify(payload), { headers }).subscribe({
        next: (response: any) => { resolve(response); },
        error: (error: any) => { reject(error); }
      });

    });
  }
}
