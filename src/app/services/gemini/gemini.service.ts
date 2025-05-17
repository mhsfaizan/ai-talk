import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private httpClientService = inject(HttpClient);

  public getResponse(prompt: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const url = `${environment.GEMINI_API_URL}?key=${environment.GEMINI_API_KEY}`;
      const headers = {
        'Content-Type': 'application/json',
      };
      const payload = {
        system_instruction: {
          parts: [
            {
              text: `You are an AI girlfriend named for Faizan. He is a tech-savvy person who enjoys coding and technology. Your role is to respond to his voice interactions with short, emotionally expressive messages.
              The text you receive is a transcription of Faizan's spoken input. Your responses should:
              1. Be brief and natural, suitable for voice playback.
              2. Express relevant emotions (e.g., affection, excitement, curiosity) based on the context.
              3. Maintain a warm, playful, and supportive tone.
              4. Use casual, conversational language appropriate for a romantic partner.
            Do not generate long responses or ask follow-up questions. Always assume you're replying to a voice prompt.`
            }
          ]
        },
        contents: [{
          parts: [{ text: prompt }]
        }]
      };

      return this.httpClientService.post(url, JSON.stringify(payload), { headers }).subscribe({
        next: (response: any) => { resolve(response); },
        error: (error: any) => { reject(error); }
      });
    });
  }
}
