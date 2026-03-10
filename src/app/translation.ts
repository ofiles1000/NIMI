import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Gemini } from './gemini';

@Component({
  selector: 'app-translation',
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <header class="space-y-2">
        <h1 class="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <mat-icon class="text-nimi-blue">translate</mat-icon>
          Technical Localization & Translation
        </h1>
        <p class="text-slate-600">
          Powered by Bhashini & Azure AI Translator for high-precision technical translation in 22+ languages.
        </p>
      </header>

      <div class="grid md:grid-cols-2 gap-8">
        <!-- Source -->
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold uppercase text-slate-500">Source (English)</span>
            <button (click)="loadSample()" class="text-xs text-nimi-blue hover:underline">Load Sample</button>
          </div>
          <textarea 
            [(ngModel)]="sourceText"
            rows="10"
            placeholder="Enter technical text to translate..."
            class="w-full p-6 bg-white rounded-2xl border border-slate-200 shadow-sm outline-none focus:ring-2 focus:ring-nimi-blue text-sm leading-relaxed"
          ></textarea>
        </div>

        <!-- Target -->
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold uppercase text-slate-500">Target Language</span>
            <select [(ngModel)]="targetLang" class="text-xs border-none bg-transparent font-bold text-nimi-blue outline-none">
              <optgroup label="Indian Regional">
                <option value="Hindi">Hindi</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Marathi">Marathi</option>
                <option value="Bengali">Bengali</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Kannada">Kannada</option>
                <option value="Malayalam">Malayalam</option>
                <option value="Punjabi">Punjabi</option>
              </optgroup>
              <optgroup label="International">
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Arabic">Arabic</option>
                <option value="Japanese">Japanese</option>
                <option value="Russian">Russian</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Korean">Korean</option>
                <option value="Chinese (Mandarin)">Chinese (Mandarin)</option>
              </optgroup>
            </select>
          </div>
          <div class="w-full h-[260px] p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner overflow-auto text-sm leading-relaxed relative">
            @if (loading()) {
              <div class="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                <div class="w-8 h-8 border-4 border-nimi-blue/30 border-t-nimi-blue rounded-full animate-spin"></div>
              </div>
            }
            @if (translatedText()) {
              <p class="whitespace-pre-wrap">{{ translatedText() }}</p>
            } @else {
              <p class="text-slate-400 italic">Translation will appear here...</p>
            }
          </div>
          <button 
            (click)="translate()"
            [disabled]="!sourceText || loading()"
            class="w-full py-3 bg-nimi-blue text-white font-bold rounded-xl hover:bg-blue-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <mat-icon>translate</mat-icon>
            Translate Now
          </button>
        </div>
      </div>

      <div class="bg-nimi-orange/10 p-6 rounded-2xl border border-nimi-orange/20 flex gap-4">
        <mat-icon class="text-nimi-orange">verified_user</mat-icon>
        <div class="space-y-1">
          <h4 class="font-bold text-slate-800 text-sm">Technical Integrity Check</h4>
          <p class="text-xs text-slate-600 leading-relaxed">
            AI ensures that technical terms (like "Vernier Caliper" or "Transformer") are either kept in English or translated using standardized vocational glossaries to avoid confusion in workshops.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Translation {
  private gemini = inject(Gemini);

  sourceText = "";
  targetLang = "Hindi";
  translatedText = signal<string | null>(null);
  loading = signal(false);

  loadSample() {
    this.sourceText = `A transformer is a static device which transfers electrical energy from one circuit to another through the process of electromagnetic induction. It is most commonly used to increase ('step up') or decrease ('step down') voltage levels between circuits. Safety must be ensured by checking the insulation resistance before operation.`;
  }

  async translate() {
    if (!this.sourceText) return;
    
    this.loading.set(true);
    this.translatedText.set(null);

    const prompt = `Translate the following technical vocational training text into ${this.targetLang}. 
    Maintain technical accuracy. If a technical term is better understood in English, keep it in brackets next to the translation.
    
    Text: ${this.sourceText}`;

    const result = await this.gemini.generateContent(prompt, "You are a professional technical translator specializing in vocational education and technical training (ITI/NIMI standards).");
    this.translatedText.set(result);
    this.loading.set(false);
  }
}
