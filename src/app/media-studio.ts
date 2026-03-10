import { ChangeDetectionStrategy, Component, signal, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Gemini } from './gemini';

@Component({
  selector: 'app-media-studio',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="max-w-6xl mx-auto py-12 px-4 space-y-8">
      <header class="space-y-2">
        <h1 class="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <mat-icon class="text-nimi-blue">movie_filter</mat-icon>
          Digital Media Studio
        </h1>
        <p class="text-slate-600">Generate scripts, animation storyboards, and AI-powered images/videos for vocational media.</p>
      </header>

      <div class="grid lg:grid-cols-4 gap-8">
        <!-- Sidebar -->
        <aside class="lg:col-span-1 space-y-6">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <form [formGroup]="form" (ngSubmit)="generate()" class="space-y-4">
              <div class="space-y-1">
                <label for="trade" class="text-xs font-bold uppercase text-slate-500">Trade</label>
                <input id="trade" formControlName="trade" placeholder="e.g. Welder" class="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-nimi-blue" />
              </div>
              <div class="space-y-1">
                <label for="topic" class="text-xs font-bold uppercase text-slate-500">Topic (Optional)</label>
                <input id="topic" formControlName="topic" placeholder="e.g. Arc Welding" class="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-nimi-blue" />
              </div>
              <div class="space-y-1">
                <label for="type" class="text-xs font-bold uppercase text-slate-500">Media Type</label>
                <select id="type" formControlName="type" class="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-nimi-blue">
                  <option value="video">Practical Demo Video Script</option>
                  <option value="animation">3D Animation Storyboard</option>
                  <option value="graphics">2D Graphic Prompts</option>
                  <option value="gen-image">Generate AI Image (Visual Aid)</option>
                  <option value="gen-video">Generate AI Video (Demo Clip)</option>
                </select>
              </div>
              <div class="space-y-1">
                <label for="language" class="text-xs font-bold uppercase text-slate-500">Language</label>
                <select id="language" formControlName="language" class="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-nimi-blue">
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

              <div class="space-y-2">
                <span id="media-ref-label" class="text-xs font-bold uppercase text-slate-500 block">Reference (Optional)</span>
                <button 
                  type="button"
                  (click)="fileInput.click()"
                  aria-labelledby="media-ref-label"
                  class="w-full px-4 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-nimi-blue"
                  [class.border-nimi-blue]="uploadedFile()"
                >
                  <mat-icon class="!text-sm">{{ uploadedFile() ? 'check_circle' : 'upload_file' }}</mat-icon>
                  {{ uploadedFile() ? 'File Added' : 'Upload File' }}
                </button>
                <input #fileInput type="file" class="hidden" (change)="onFileSelected($event)" accept=".pdf,.txt,.doc,.docx" />
              </div>

              @if (form.get('type')?.value === 'gen-video' && !hasApiKey()) {
                <div class="p-4 bg-orange-50 border border-orange-100 rounded-xl space-y-3">
                  <p class="text-xs text-orange-800 leading-relaxed">
                    Video generation requires a paid Gemini API key. Please select your key to continue.
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" class="underline font-bold">Billing Info</a>
                  </p>
                  <button 
                    type="button"
                    (click)="selectKey()"
                    class="w-full py-2 bg-orange-500 text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition-colors"
                  >
                    Select API Key
                  </button>
                </div>
              }

              <button 
                type="submit" 
                [disabled]="form.invalid || loading() || (form.get('type')?.value === 'gen-video' && !hasApiKey())"
                class="w-full bg-nimi-blue text-white font-bold py-3 rounded-xl hover:bg-blue-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                @if (loading()) {
                  <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                } @else {
                  <mat-icon>{{ getIcon() }}</mat-icon>
                }
                {{ getButtonLabel() }}
              </button>
            </form>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="lg:col-span-3 space-y-6">
          @if (generatedImage()) {
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div class="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <span class="text-xs font-bold uppercase text-slate-500 tracking-widest">Generated Visual Aid</span>
                <a [href]="generatedImage()" download="visual-aid.png" class="text-nimi-blue hover:underline text-xs font-bold">Download Image</a>
              </div>
              <div class="p-8 flex justify-center">
                <img [src]="generatedImage()" class="max-w-full h-auto rounded-xl shadow-lg border border-slate-100" alt="Generated visual aid" />
              </div>
            </div>
          } @else if (generatedVideo()) {
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div class="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <span class="text-xs font-bold uppercase text-slate-500 tracking-widest">Generated Demo Clip</span>
                <a [href]="generatedVideo()" download="demo-clip.mp4" class="text-nimi-blue hover:underline text-xs font-bold">Download Video</a>
              </div>
              <div class="p-8 flex justify-center">
                <video [src]="generatedVideo()" controls class="max-w-full h-auto rounded-xl shadow-lg border border-slate-100"></video>
              </div>
            </div>
          } @else if (result()) {
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div class="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <span class="text-xs font-bold uppercase text-slate-500 tracking-widest">Generated Media Brief</span>
                <div class="flex gap-4">
                  <button (click)="downloadBrief()" class="text-nimi-blue hover:underline text-xs font-bold flex items-center gap-1">
                    <mat-icon class="!text-sm">download</mat-icon> Download
                  </button>
                  <button (click)="copy()" class="text-nimi-blue hover:underline text-xs font-bold">Copy Text</button>
                </div>
              </div>
              <div class="p-8 prose prose-slate max-w-none" [innerHTML]="result()"></div>
            </div>
          } @else if (loading()) {
            <div class="bg-white p-12 rounded-2xl border border-slate-100 animate-pulse space-y-6">
              <div class="h-8 bg-slate-100 rounded w-1/2 mx-auto"></div>
              <div class="space-y-3">
                <div class="h-4 bg-slate-50 rounded w-full"></div>
                <div class="h-4 bg-slate-50 rounded w-full"></div>
                <div class="h-4 bg-slate-50 rounded w-3/4"></div>
              </div>
              @if (form.get('type')?.value === 'gen-video') {
                <div class="text-center py-8">
                  <p class="text-sm text-slate-500">Video generation can take 1-2 minutes. Please stay on this page...</p>
                </div>
              }
            </div>
          } @else {
            <div class="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center space-y-4">
              <mat-icon class="!text-6xl text-slate-300">video_library</mat-icon>
              <h3 class="text-xl font-bold text-slate-400">Ready to visualize?</h3>
              <p class="text-slate-400 max-w-md mx-auto">Enter a trade and topic to generate professional scripts, storyboards, or AI-powered visual content for your digital learning modules.</p>
            </div>
          }
        </main>
      </div>
    </div>
  `,
  styles: [`
    @reference "tailwindcss";
    :host { display: block; }
    ::ng-deep .prose h2 { @apply text-xl font-bold text-blue-900 mt-8 mb-4 border-b pb-2; }
    ::ng-deep .prose h3 { @apply text-lg font-bold text-slate-800 mt-6 mb-2; }
    ::ng-deep .prose p { @apply text-slate-600 mb-4; }
    ::ng-deep .prose ul { @apply list-disc pl-5 mb-4 space-y-2; }
    ::ng-deep .prose strong { @apply text-slate-900; }
    ::ng-deep .prose blockquote { @apply border-l-4 border-orange-400 pl-4 italic text-slate-500 my-4; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaStudio implements OnInit {
  private fb = inject(FormBuilder);
  private gemini = inject(Gemini);
  private platformId = inject(PLATFORM_ID);

  form = this.fb.group({
    trade: ['', Validators.required],
    topic: [''],
    type: ['video', Validators.required],
    language: ['English', Validators.required]
  });

  loading = signal(false);
  result = signal<string | null>(null);
  generatedImage = signal<string | null>(null);
  generatedVideo = signal<string | null>(null);
  hasApiKey = signal(false);
  uploadedFile = signal<File | null>(null);
  fileContent = signal<string | null>(null);

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      this.uploadedFile.set(file);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.fileContent.set(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  }

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.hasApiKey.set(await (window as any).aistudio.hasSelectedApiKey());
    }
  }

  async selectKey() {
    if (isPlatformBrowser(this.platformId)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (window as any).aistudio.openSelectKey();
      this.hasApiKey.set(true);
    }
  }

  getIcon() {
    const type = this.form.get('type')?.value;
    if (type === 'gen-image') return 'image';
    if (type === 'gen-video') return 'videocam';
    return 'movie';
  }

  getButtonLabel() {
    const type = this.form.get('type')?.value;
    if (type === 'gen-image') return 'Generate Image';
    if (type === 'gen-video') return 'Generate Video';
    return 'Generate Brief';
  }

  async generate() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.result.set(null);
    this.generatedImage.set(null);
    this.generatedVideo.set(null);

    const { trade, topic, type, language } = this.form.value;
    const context = this.fileContent() ? `\n\nReference Document Content:\n${this.fileContent()}` : '';

    if (type === 'gen-image') {
      const prompt = `A professional, high-quality, standardized technical illustration for ITI Trade: ${trade || 'General'}. Topic: ${topic || 'General'}. Clear, educational, and detailed. ${context || ''}`;
      const img = await this.gemini.generateImage(prompt);
      if (img) {
        this.generatedImage.set(img);
      } else {
        // Fallback to text brief if image fails
        console.warn("Image generation failed, falling back to text brief.");
        await this.generateTextBrief('graphics', trade || '', topic || '', language || 'English', context || '');
      }
    } else if (type === 'gen-video') {
      const prompt = `A short, educational, humanized 3D animation clip demonstrating ${topic || 'core skills'} for the ${trade || 'General'} trade. High quality, technical, and clear. ${context || ''}`;
      const video = await this.gemini.generateVideo(prompt);
      if (video) {
        this.generatedVideo.set(video);
      } else {
        // Fallback to text brief if video fails
        console.warn("Video generation failed, falling back to text brief.");
        await this.generateTextBrief('animation', trade || '', topic || '', language || 'English', context || '');
      }
    } else {
      await this.generateTextBrief(type || 'video', trade || '', topic || '', language || 'English', context || '');
    }

    this.loading.set(false);
  }

  private async generateTextBrief(type: string, trade: string, topic: string, language: string, context: string) {
    const baseInstruction = `Generate high-quality, humanized, and standardized media content for the ITI trade: ${trade}. 
    Topic: ${topic || 'General Trade Overview'}.
    Language: ${language}.
    ${context}`;

    let prompt = "";
    if (type === 'video') {
      prompt = `${baseInstruction}
      Format: Professional Demo Video Script.
      Include:
      1. Humanized Scene-by-scene breakdown (Visuals vs Audio/Narration).
      2. Time estimates for each scene.
      3. Key safety callouts (Standardized).
      4. On-screen text/graphics overlay suggestions.
      Use Markdown formatting.`;
    } else if (type === 'animation') {
      prompt = `${baseInstruction}
      Format: 3D Animation Storyboard.
      Include:
      1. Technical breakdown of the 3D model needed (Standardized).
      2. Humanized Animation sequence (how parts move, rotate, or highlight).
      3. Camera angles and lighting suggestions.
      4. Educational, easy-to-understand voiceover script.
      Use Markdown formatting.`;
    } else {
      prompt = `${baseInstruction}
      Format: 2D Graphic Prompts and Layouts.
      Include:
      1. Detailed prompts for AI Image Generators to create standardized technical diagrams.
      2. Humanized Infographic layout structure.
      3. Labeling requirements for parts.
      4. Color palette suggestions for technical clarity.
      Use Markdown formatting.`;
    }

    const content = await this.gemini.generateContent(prompt);
    const html = content
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/\n/g, '<br/>');

    this.result.set(html);
  }

  copy() {
    if (isPlatformBrowser(this.platformId) && this.result()) {
      navigator.clipboard.writeText(this.result()!.replace(/<[^>]*>/g, ''));
      alert("Brief copied to clipboard!");
    }
  }

  downloadBrief() {
    if (!isPlatformBrowser(this.platformId) || !this.result()) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>NIMI Media Brief - ${this.form.value.topic}</title>
        <style>
          body { font-family: sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 40px auto; padding: 20px; }
          h1 { color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; }
          h2 { color: #1e40af; margin-top: 30px; }
          h3 { color: #1e3a8a; }
          .footer { margin-top: 50px; font-size: 12px; color: #666; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div style="text-align: center; color: #666; font-size: 14px; margin-bottom: 20px;">
          Trade: ${this.form.value.trade} | Language: ${this.form.value.language}
        </div>
        ${this.result()}
        <div class="footer">Generated by NIMI Digital Media Studio</div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NIMI_MediaBrief_${this.form.value.topic?.replace(/\s+/g, '_')}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
