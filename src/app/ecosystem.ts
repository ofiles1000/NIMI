import { ChangeDetectionStrategy, Component, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Gemini } from './gemini';

interface PromptCategory {
  id: string;
  name: string;
  icon: string;
  tools: string[];
  description: string;
}

@Component({
  selector: 'app-ecosystem',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="max-w-6xl mx-auto py-12 px-4 space-y-8">
      <header class="space-y-2">
        <h1 class="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <mat-icon class="text-nimi-blue">hub</mat-icon>
          AI Ecosystem & Prompt Architect
        </h1>
        <p class="text-slate-600">Generate optimized prompts for external AI tools to enhance your NIMI content production.</p>
      </header>

      <div class="grid lg:grid-cols-4 gap-8">
        <!-- Sidebar -->
        <aside class="lg:col-span-1 space-y-6">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <form [formGroup]="form" (ngSubmit)="generate()" class="space-y-4">
              <div class="space-y-1">
                <label for="trade" class="text-xs font-bold uppercase text-slate-500">Trade</label>
                <input id="trade" formControlName="trade" placeholder="e.g. Electrician" class="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-nimi-blue" />
              </div>
              <div class="space-y-1">
                <label for="topic" class="text-xs font-bold uppercase text-slate-500">Topic</label>
                <input id="topic" formControlName="topic" placeholder="e.g. Solar Panel Installation" class="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-nimi-blue" />
              </div>
              <button 
                type="submit" 
                [disabled]="form.invalid || loading()"
                class="w-full bg-nimi-blue text-white font-bold py-3 rounded-xl hover:bg-blue-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                @if (loading()) {
                  <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                } @else {
                  <mat-icon>auto_awesome</mat-icon>
                }
                Architect Prompts
              </button>
            </form>
          </div>

          <div class="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex gap-3">
            <mat-icon class="text-indigo-600">lightbulb</mat-icon>
            <p class="text-xs text-indigo-800 leading-relaxed">
              Copy these prompts into external tools like NotebookLM or Claude to get specialized outputs for your NIMI modules.
            </p>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="lg:col-span-3 space-y-6">
          @if (loading()) {
            <div class="grid md:grid-cols-2 gap-6">
              @for (i of [1,2,3,4]; track i) {
                <div class="bg-white p-6 rounded-2xl border border-slate-100 animate-pulse space-y-4">
                  <div class="h-6 bg-slate-100 rounded w-1/2"></div>
                  <div class="h-20 bg-slate-50 rounded w-full"></div>
                </div>
              }
            </div>
          } @else if (prompts().length > 0) {
            <div class="grid md:grid-cols-2 gap-6">
              @for (cat of categories; track cat.id) {
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                  <div class="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <div class="flex items-center gap-2">
                      <mat-icon class="text-nimi-blue !text-lg">{{ cat.icon }}</mat-icon>
                      <span class="text-xs font-bold uppercase text-slate-700 tracking-wider">{{ cat.name }}</span>
                    </div>
                  </div>
                  <div class="p-5 flex-1 space-y-4">
                    <p class="text-xs text-slate-500">{{ cat.description }}</p>
                    <div class="flex flex-wrap gap-2">
                      @for (tool of cat.tools; track tool) {
                        <span class="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold border border-slate-200">{{ tool }}</span>
                      }
                    </div>
                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 relative group">
                      <p class="text-sm text-slate-700 leading-relaxed italic">
                        {{ getPromptForCategory(cat.id) }}
                      </p>
                      <button 
                        (click)="copy(getPromptForCategory(cat.id))"
                        class="absolute top-2 right-2 p-1.5 bg-white shadow-sm border border-slate-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50"
                      >
                        <mat-icon class="!text-sm text-slate-400">content_copy</mat-icon>
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center space-y-4">
              <mat-icon class="!text-6xl text-slate-300">extension</mat-icon>
              <h3 class="text-xl font-bold text-slate-400">Ecosystem Integration</h3>
              <p class="text-slate-400 max-w-md mx-auto">Enter a trade and topic to generate specialized prompts for NotebookLM, Claude, ElevenLabs, and other industry-leading AI tools.</p>
            </div>
          }
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Ecosystem {
  private fb = inject(FormBuilder);
  private gemini = inject(Gemini);
  private platformId = inject(PLATFORM_ID);

  form = this.fb.group({
    trade: ['', Validators.required],
    topic: ['', Validators.required]
  });

  loading = signal(false);
  prompts = signal<{ categoryId: string; prompt: string }[]>([]);

  categories: PromptCategory[] = [
    { 
      id: 'content', 
      name: 'Drafting & Structuring', 
      icon: 'edit_note', 
      tools: ['Microsoft Copilot', 'Claude 3', 'Notion AI', 'Writer.com', 'Jasper AI'],
      description: 'Prompts for deep research, drafting, and structuring technical manuals.'
    },
    { 
      id: 'translation', 
      name: 'Translation & Terminology', 
      icon: 'translate', 
      tools: ['Bhashini', 'Azure AI Translator', 'DeepL Pro'],
      description: 'Prompts to ensure technical terminology is preserved during regional translation.'
    },
    { 
      id: 'assessment', 
      name: 'Assessments & MCQs', 
      icon: 'quiz', 
      tools: ['PrepAI', 'OpenAI API', 'Quizgecko'],
      description: 'Prompts for generating high-quality MCQs, numericals, and auto-tagging.'
    },
    { 
      id: 'video', 
      name: 'Video & Avatar Production', 
      icon: 'movie', 
      tools: ['Synthesia', 'HeyGen', 'Runway ML', 'Pika Labs', 'Kaiber AI'],
      description: 'Prompts for AI avatar scripts, instructional videos, and storyboards.'
    },
    { 
      id: 'voice', 
      name: 'Multilingual Voiceovers', 
      icon: 'record_voice_over', 
      tools: ['ElevenLabs', 'Murf.ai'],
      description: 'Prompts for natural-sounding multilingual technical narrations.'
    },
    { 
      id: 'design', 
      name: 'Graphics & Storyboarding', 
      icon: 'palette', 
      tools: ['Canva Magic Studio', 'Midjourney', 'Stable Diffusion', 'Storyboard That', 'Boords'],
      description: 'Prompts for 2D illustrations, safety posters, and technical diagrams.'
    },
    { 
      id: 'orchestration', 
      name: 'Frameworks & Prompting', 
      icon: 'terminal', 
      tools: ['LangChain', 'LlamaIndex', 'Microsoft Copilot Studio', 'PromptPerfect', 'FlowGPT'],
      description: 'Prompts for building custom AI agents and optimizing prompt performance.'
    }
  ];

  getPromptForCategory(id: string) {
    return this.prompts().find(p => p.categoryId === id)?.prompt || '';
  }

  async generate() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.prompts.set([]);

    const { trade, topic } = this.form.value;
    
    const prompt = `Generate specialized AI prompts for the following ITI Trade: ${trade} and Topic: ${topic}.
    For each category, provide ONE highly optimized prompt that can be used in the specified tools.
    
    Categories:
    1. Drafting & Structuring (Copilot, Claude, Notion AI, Writer.com): For drafting technical manuals.
    2. Translation (Bhashini, Azure, DeepL): For technical localization.
    3. Assessments (PrepAI, OpenAI, Quizgecko): For MCQ generation and auto-tagging.
    4. Video Production (Synthesia, HeyGen, Runway, Pika): For avatar-based demo scripts and storyboards.
    5. Voice Generation (ElevenLabs, Murf): For technical narration.
    6. Graphics (Canva, Midjourney, Stable Diffusion, Storyboard That): For technical illustrations.
    7. Orchestration (LangChain, LlamaIndex, Copilot Studio, PromptPerfect): For building custom AI agents.
    
    Return the result as a JSON array of objects with 'categoryId' and 'prompt' fields.
    Category IDs: content, translation, assessment, video, voice, design, orchestration.`;

    const schema = {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          categoryId: { type: 'STRING' },
          prompt: { type: 'STRING' }
        },
        required: ['categoryId', 'prompt']
      }
    };

    const result = await this.gemini.generateJson<{ categoryId: string; prompt: string }[]>(prompt, schema);
    if (result) {
      this.prompts.set(result);
    }
    this.loading.set(false);
  }

  copy(text: string) {
    if (isPlatformBrowser(this.platformId)) {
      navigator.clipboard.writeText(text);
      alert("Prompt copied to clipboard!");
    }
  }
}
