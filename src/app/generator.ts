import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Gemini } from './gemini';

@Component({
  selector: 'app-generator',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="max-w-5xl mx-auto py-12 px-4 space-y-8">
      <header class="space-y-2">
        <h1 class="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <mat-icon class="text-nimi-blue">auto_stories</mat-icon>
          Curriculum Content Architect
        </h1>
        <p class="text-slate-600">Generate structured instructional material for any ITI trade topic.</p>
      </header>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Input Panel -->
        <aside class="lg:col-span-1 space-y-6">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <form [formGroup]="form" (ngSubmit)="generate()" class="space-y-4">
              <div class="space-y-1">
                <label for="trade" class="text-xs font-bold uppercase tracking-wider text-slate-500">Trade / Subject</label>
                <input 
                  id="trade"
                  formControlName="trade"
                  placeholder="e.g., Electrician, Fitter, COPA"
                  class="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-nimi-blue outline-none"
                />
              </div>
              <div class="space-y-1">
                <label for="topic" class="text-xs font-bold uppercase tracking-wider text-slate-500">Topic / Syllabus Point</label>
                <textarea 
                  id="topic"
                  formControlName="topic"
                  rows="4"
                  placeholder="e.g., Types of Hand Stitches, Ohms Law, Lathe Machine Operations"
                  class="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-nimi-blue outline-none"
                ></textarea>
              </div>
              <div class="space-y-1">
                <label for="format" class="text-xs font-bold uppercase tracking-wider text-slate-500">Output Format</label>
                <select 
                  id="format"
                  formControlName="format"
                  class="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-nimi-blue outline-none"
                >
                  <option value="theory">Trade Theory Manual</option>
                  <option value="practical">Trade Practical Guide</option>
                  <option value="brief">Digital Content Brief</option>
                </select>
              </div>
              <div class="space-y-1">
                <label for="language" class="text-xs font-bold uppercase tracking-wider text-slate-500">Language</label>
                <select 
                  id="language"
                  formControlName="language"
                  class="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-nimi-blue outline-none"
                >
                  <optgroup label="Indian Regional">
                    <option value="English">English</option>
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
              <div class="flex items-center gap-2 py-2">
                <input type="checkbox" id="includeImage" formControlName="includeImage" class="w-4 h-4 text-nimi-blue rounded border-slate-300 focus:ring-nimi-blue" />
                <label for="includeImage" class="text-xs font-bold uppercase tracking-wider text-slate-500 cursor-pointer">Include Visual Aid (AI Image)</label>
              </div>
              <button 
                type="submit"
                [disabled]="form.invalid || loading()"
                class="w-full py-3 bg-nimi-blue text-white font-bold rounded-xl hover:bg-blue-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                @if (loading()) {
                  <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating...
                } @else {
                  <mat-icon>bolt</mat-icon>
                  Generate Content
                }
              </button>
            </form>
          </div>

          <div class="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
            <mat-icon class="text-blue-600">info</mat-icon>
            <p class="text-xs text-blue-800 leading-relaxed">
              AI uses NCVT/NIMI standards to structure content. Always review generated material for technical compliance.
            </p>
          </div>
        </aside>

        <!-- Output Panel -->
        <main class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[500px] flex flex-col">
            <div class="p-4 border-bottom border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
              <span class="text-sm font-medium text-slate-500">Generated Content</span>
              <div class="flex gap-2">
                <button (click)="copy()" class="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600" title="Copy to Clipboard">
                  <mat-icon class="!text-sm">content_copy</mat-icon>
                </button>
                <button (click)="download()" class="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-600" title="Download HTML">
                  <mat-icon class="!text-sm">download</mat-icon>
                </button>
              </div>
            </div>
            
            <div class="p-8 flex-1 overflow-auto prose prose-slate max-w-none">
              @if (generatedImage()) {
                <div class="mb-8 flex justify-center">
                  <img [src]="generatedImage()" class="max-w-full h-auto rounded-xl shadow-lg border border-slate-100" alt="Generated visual aid" />
                </div>
              }
              @if (content()) {
                <div [innerHTML]="content()"></div>
              } @else if (loading()) {
                <div class="space-y-4 animate-pulse">
                  <div class="h-8 bg-slate-100 rounded w-3/4"></div>
                  <div class="h-4 bg-slate-100 rounded w-full"></div>
                  <div class="h-4 bg-slate-100 rounded w-full"></div>
                  <div class="h-4 bg-slate-100 rounded w-5/6"></div>
                  <div class="h-32 bg-slate-100 rounded w-full"></div>
                </div>
              } @else {
                <div class="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 py-20">
                  <mat-icon class="!text-6xl opacity-20">description</mat-icon>
                  <p>Enter details and click generate to see AI-powered content.</p>
                </div>
              }
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    @reference "tailwindcss";
    :host { display: block; }
    ::ng-deep .prose h1 { @apply text-2xl font-bold text-blue-900 mb-4; }
    ::ng-deep .prose h2 { @apply text-xl font-bold text-slate-800 mt-6 mb-3; }
    ::ng-deep .prose p { @apply text-slate-600 mb-4 leading-relaxed; }
    ::ng-deep .prose ul { @apply list-disc pl-5 mb-4 space-y-1; }
    ::ng-deep .prose ol { @apply list-decimal pl-5 mb-4 space-y-1; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Generator {
  private fb = inject(FormBuilder);
  private gemini = inject(Gemini);

  form = this.fb.group({
    trade: ['', Validators.required],
    topic: ['', Validators.required],
    format: ['theory', Validators.required],
    language: ['English', Validators.required],
    includeImage: [false]
  });

  loading = signal(false);
  content = signal<string | null>(null);
  generatedImage = signal<string | null>(null);

  async generate() {
    if (this.form.invalid) return;
    
    this.loading.set(true);
    this.content.set(null);
    this.generatedImage.set(null);

    const { trade, topic, format, language, includeImage } = this.form.value;
    
    let prompt = "";
    if (format === 'theory') {
      prompt = `Generate a comprehensive Trade Theory lesson for the ITI trade: ${trade}. Topic: ${topic}. 
      Language: ${language}.
      Include:
      1. Introduction
      2. Learning Objectives
      3. Detailed Technical Explanation (with subheadings)
      4. Safety Precautions
      5. Summary
      Use Markdown formatting. Maintain technical accuracy.`;
    } else if (format === 'practical') {
      prompt = `Generate a Trade Practical guide for the ITI trade: ${trade}. Topic: ${topic}.
      Language: ${language}.
      Include:
      1. Aim of the Practical
      2. Tools & Equipment Required (List)
      3. Raw Materials Required
      4. Step-by-Step Procedure
      5. Safety Precautions
      6. Conclusion/Result
      Use Markdown formatting. Maintain technical accuracy.`;
    } else {
      prompt = `Generate a Digital Content Brief for an e-learning module. Trade: ${trade}. Topic: ${topic}.
      Language: ${language}.
      Include:
      1. Video Script Outline (Scene by Scene)
      2. Simulation Ideas (How to make it interactive)
      3. Key Visuals/Graphics needed
      4. Quiz points for the module
      Use Markdown formatting. Maintain technical accuracy.`;
    }

    const [result, img] = await Promise.all([
      this.gemini.generateContent(prompt),
      includeImage ? this.gemini.generateImage(`A professional technical illustration for ${trade}: ${topic}. Clear, educational, and detailed.`) : Promise.resolve(null)
    ]);

    this.generatedImage.set(img);

    // Simple markdown to HTML conversion (basic)
    const html = result
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/\n/g, '<br/>');
    
    this.content.set(html);
    this.loading.set(false);
  }

  copy() {
    if (this.content()) {
      navigator.clipboard.writeText(this.content()!.replace(/<[^>]*>/g, ''));
      alert("Content copied to clipboard!");
    }
  }

  download() {
    if (!this.content()) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>NIMI Content - ${this.form.value.topic}</title>
        <style>
          body { font-family: sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 40px auto; padding: 20px; }
          h1 { color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; }
          h2 { color: #1e40af; margin-top: 30px; }
          h3 { color: #1e3a8a; }
          .image-container { text-align: center; margin: 30px 0; }
          img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .footer { margin-top: 50px; font-size: 12px; color: #666; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        ${this.generatedImage() ? `<div class="image-container"><img src="${this.generatedImage()}" alt="Technical Illustration"></div>` : ''}
        ${this.content()}
        <div class="footer">Generated by NIMI AI Curriculum Architect</div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NIMI_${this.form.value.topic?.replace(/\s+/g, '_')}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
