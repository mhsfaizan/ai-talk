import { CommonModule } from '@angular/common';
import { Component, effect, ElementRef, inject, Renderer2, ViewChild } from '@angular/core';
import { OpenAiService } from './services/open-ai/open-ai.service';
import { SpeechService } from './services/speech/speech.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CommonModule],
})
export class AppComponent {

  private speechService = inject(SpeechService);
  private openAiService = inject(OpenAiService);
  public messages = this.speechService.Messages;
  public isListening = this.speechService.IsListening;

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  constructor(private renderer: Renderer2) {
    effect(() => {
      console.log('Messages updated:', this.messages());
      setTimeout(() => {
        this.scrollToBottom();
      }, 0);
    });
  }

  public startSpeak(): void {
    this.speechService.startSpeak();
  }

  private scrollToBottom(): void {
    if (this.chatContainer) {
      const element = this.chatContainer.nativeElement;
      this.renderer.setProperty(element, 'scrollTop', element.scrollHeight);
    }
  }
}
