import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Gemini } from './gemini';
import { Type } from "@google/genai";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  competency: 'Knowledge' | 'Understanding' | 'Application';
}

@Component({
  selector: 'app-assessment',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="max-w-5xl mx-auto py-12 px-4 space-y-8">
      <header class="text-center space-y-2">
        <h1 class="text-3xl font-bold text-slate-900">CTS/CITS Question Bank Architect</h1>
        <p class="text-slate-600">Generate high-quality, tagged assessments for vocational certification.</p>
      </header>

      <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <form [formGroup]="form" (ngSubmit)="generate()" class="grid md:grid-cols-4 gap-6 items-end">
          <div class="md:col-span-1 space-y-1">
            <label for="trade" class="text-xs font-bold uppercase text-slate-500">Trade</label>
            <input id="trade" formControlName="trade" placeholder="e.g. Electrician" class="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-nimi-blue" />
          </div>
          <div class="md:col-span-1 space-y-1">
            <label for="topic" class="text-xs font-bold uppercase text-slate-500">Topic</label>
            <input id="topic" formControlName="topic" placeholder="e.g. AC Motors" class="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-nimi-blue" />
          </div>
          <div class="md:col-span-1 space-y-1">
            <label for="count" class="text-xs font-bold uppercase text-slate-500">Question Count</label>
            <select id="count" formControlName="count" class="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-nimi-blue">
              <option [value]="5">5 Questions</option>
              <option [value]="10">10 Questions</option>
            </select>
          </div>
          <button 
            type="submit" 
            [disabled]="form.invalid || loading()"
            class="bg-nimi-blue text-white font-bold py-2 rounded-lg hover:bg-blue-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            @if (loading()) {
              <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            } @else {
              <mat-icon>quiz</mat-icon>
            }
            Generate Bank
          </button>
        </form>
      </div>

      @if (questions().length > 0) {
        <div class="space-y-6">
          <div class="flex justify-between items-center bg-slate-100 p-4 rounded-xl">
            <div class="flex gap-4">
              <span class="text-xs font-bold text-slate-500 uppercase">Stats:</span>
              <span class="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded">Easy: {{ getCount('Easy') }}</span>
              <span class="text-xs font-medium text-orange-700 bg-orange-100 px-2 py-0.5 rounded">Medium: {{ getCount('Medium') }}</span>
              <span class="text-xs font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded">Hard: {{ getCount('Hard') }}</span>
            </div>
            <button (click)="showAnswers.set(!showAnswers())" class="text-xs font-bold text-nimi-blue hover:underline">
              {{ showAnswers() ? 'Hide' : 'Show' }} Answers
            </button>
          </div>

          @for (q of questions(); track $index) {
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div class="flex justify-between items-start gap-4">
                <div class="flex flex-col gap-1">
                  <span class="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[10px] font-bold w-fit">Q{{ $index + 1 }}</span>
                  <div class="flex gap-2">
                    <span [class]="'text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ' + getDifficultyClass(q.difficulty)">
                      {{ q.difficulty }}
                    </span>
                    <span class="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
                      {{ q.competency }}
                    </span>
                  </div>
                </div>
                <p class="flex-1 font-medium text-slate-800">{{ q.question }}</p>
              </div>
              <div class="grid md:grid-cols-2 gap-3 pl-14">
                @for (opt of q.options; track $index) {
                  <div 
                    class="p-3 rounded-xl border border-slate-100 text-sm flex items-center gap-3"
                    [class.bg-green-50]="showAnswers() && $index === q.correctAnswer"
                    [class.border-green-200]="showAnswers() && $index === q.correctAnswer"
                  >
                    <span class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">{{ ['A','B','C','D'][$index] }}</span>
                    {{ opt }}
                    @if (showAnswers() && $index === q.correctAnswer) {
                      <mat-icon class="text-green-600 !text-sm ml-auto">check_circle</mat-icon>
                    }
                  </div>
                }
              </div>
              @if (showAnswers()) {
                <div class="pl-14 pt-2">
                  <p class="text-xs text-slate-500 leading-relaxed">
                    <span class="font-bold text-slate-700">Technical Explanation:</span> {{ q.explanation }}
                  </p>
                </div>
              }
            </div>
          }
        </div>
      } @else if (loading()) {
        <div class="space-y-6">
          @for (i of [1,2,3]; track i) {
            <div class="bg-white p-6 rounded-2xl border border-slate-100 animate-pulse space-y-4">
              <div class="h-6 bg-slate-100 rounded w-3/4"></div>
              <div class="grid grid-cols-2 gap-4">
                <div class="h-10 bg-slate-50 rounded"></div>
                <div class="h-10 bg-slate-50 rounded"></div>
                <div class="h-10 bg-slate-50 rounded"></div>
                <div class="h-10 bg-slate-50 rounded"></div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Assessment {
  private fb = inject(FormBuilder);
  private gemini = inject(Gemini);

  form = this.fb.group({
    trade: ['', Validators.required],
    topic: ['', Validators.required],
    count: [5, Validators.required]
  });

  loading = signal(false);
  questions = signal<Question[]>([]);
  showAnswers = signal(false);

  getCount(diff: string) {
    return this.questions().filter(q => q.difficulty === diff).length;
  }

  getDifficultyClass(diff: string) {
    switch(diff) {
      case 'Easy': return 'bg-green-50 text-green-600 border border-green-100';
      case 'Medium': return 'bg-orange-50 text-orange-600 border border-orange-100';
      case 'Hard': return 'bg-red-50 text-red-600 border border-red-100';
      default: return '';
    }
  }

  async generate() {
    if (this.form.invalid) return;
    
    this.loading.set(true);
    this.questions.set([]);
    this.showAnswers.set(false);

    const { trade, topic, count } = this.form.value;
    const prompt = `Generate ${count} high-quality multiple choice questions for the ITI trade: ${trade} on the topic: ${topic}. 
    For each question:
    1. Provide 4 options, 1 correct answer (index 0-3).
    2. Tag difficulty as 'Easy', 'Medium', or 'Hard'.
    3. Tag competency as 'Knowledge', 'Understanding', or 'Application'.
    4. Provide a detailed technical explanation.
    Ensure questions align with NCVT/NIMI assessment standards for CTS/CITS.`;

    const schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { 
            type: Type.ARRAY,
            items: { type: Type.STRING },
            minItems: 4,
            maxItems: 4
          },
          correctAnswer: { type: Type.INTEGER },
          explanation: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
          competency: { type: Type.STRING, enum: ['Knowledge', 'Understanding', 'Application'] }
        },
        required: ["question", "options", "correctAnswer", "explanation", "difficulty", "competency"]
      }
    };

    const result = await this.gemini.generateJson<Question[]>(prompt, schema);
    if (result) {
      this.questions.set(result);
    }
    this.loading.set(false);
  }
}
