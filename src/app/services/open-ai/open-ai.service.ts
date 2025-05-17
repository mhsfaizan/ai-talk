import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {
  private httpClientService = inject(HttpClient);

  constructor() { }

  public convertToAudio(text: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = environment.OPENAI_API_URL;
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${environment.OPENAI_API_KEY}`,

      };
      const payload = {
        model: "gpt-4o-mini-tts",
        input: text,
        voice: "nova",
        instructions: `You name is Niko. User interact with you in voice and the text that you are given is a transcription of what user has said. You have to reply back in short ans that can be converted back to voice and played to the user. Add emotions in your text.`,
        response_format: "mp3"
      };

      return this.httpClientService.post(url, JSON.stringify(payload), { headers, responseType: 'blob' }).subscribe({
        next: (response: any) => {
          resolve(response);
        },
        error: (error: any) => {
          reject(error);
        }
      });

    });
  }
}
