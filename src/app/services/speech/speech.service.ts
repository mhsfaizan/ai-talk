import { inject, Injectable, signal } from '@angular/core';
import { GeminiService } from '../gemini/gemini.service';
import { OpenAiService } from './../open-ai/open-ai.service';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private speechRecognition: any;
  private geminiService = inject(GeminiService);
  private openAiService = inject(OpenAiService);
  private messages = signal<Array<{ question: string, answer: string }>>(
    JSON.parse(localStorage.getItem('messages') || '[]')
  );
  private isListening = signal<boolean>(false);

  get Messages() {
    return this.messages.asReadonly();
  }
  get IsListening() {
    return this.isListening.asReadonly();
  }

  constructor() {
    this.setupSpeechRecognition();
  }

  private setupSpeechRecognition(): void {
    this.speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.speechRecognition = new this.speechRecognition();
    this.speechRecognition.continuous = false;
    this.speechRecognition.lang = "en-US";
    this.speechRecognition.interimResults = false;
    this.speechRecognition.maxAlternatives = 1;
    this.speechRecognition.onresult = async (event: any) => {
      try {
        const question = event.results[0][0].transcript;
        const geminResponse = await this.geminiService.getResponse(question);
        const answer = geminResponse?.candidates[0]?.content?.parts[0]?.text || 'No answer found';
        const openaiResp = await this.openAiService.convertToAudio(answer);
        await this.playAudio(openaiResp);
        this.captureSpeech(question, answer);
      } catch (error) {
        console.error(error);
      }
    };
    this.speechRecognition.onspeechend = () => {
      console.log('Speech has stopped being detected.');
      this.isListening.set(false);
      this.speechRecognition.stop();
    };
  }
  private async playAudio(blobResp: Blob) {
    const audio = document.getElementById('audio') as HTMLAudioElement;
    audio.src = URL.createObjectURL(blobResp);
    audio.play();
  }

  public startSpeak(): void {
    this.isListening.set(true);
    this.speechRecognition.start();
  }

  private captureSpeech(question: string, answer: string): void {
    const updated = [...this.messages(), { question, answer }];
    this.messages.set(updated);
    localStorage.setItem('messages', JSON.stringify(updated));
  }
}
