import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface Tool {
  name: string;
  category: string;
  description: string;
  useCase: string;
  status: 'Integrated' | 'External' | 'Partner';
}

@Component({
  selector: 'app-integrations',
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="max-w-6xl mx-auto py-12 px-4 space-y-12">
      <header class="text-center space-y-4">
        <h1 class="text-4xl font-bold text-slate-900">NIMI AI <span class="gradient-text">Power Stack</span></h1>
        <p class="text-slate-600 max-w-2xl mx-auto">
          We leverage a best-in-class AI ecosystem to deliver standardized, high-quality vocational content. 
          Our platform orchestrates these tools to ensure technical accuracy and regional relevance.
        </p>
      </header>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (category of categories; track category.name) {
          <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div class="p-6 bg-slate-50 border-b border-slate-100">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-white rounded-lg shadow-sm">
                  <mat-icon class="text-nimi-blue">{{ category.icon }}</mat-icon>
                </div>
                <h2 class="font-bold text-slate-800">{{ category.name }}</h2>
              </div>
            </div>
            <div class="p-6 flex-1 space-y-6">
              @for (tool of getToolsByCategory(category.name); track tool.name) {
                <div class="space-y-2">
                  <div class="flex justify-between items-start">
                    <h3 class="font-bold text-slate-900 text-sm">{{ tool.name }}</h3>
                    <span [class]="getStatusClass(tool.status)" class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {{ tool.status }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-600 leading-relaxed">{{ tool.description }}</p>
                  <div class="flex items-center gap-1.5 text-[10px] font-bold text-nimi-blue uppercase tracking-tight">
                    <mat-icon class="!text-xs">bolt</mat-icon>
                    <span>{{ tool.useCase }}</span>
                  </div>
                </div>
                @if (!$last) {
                  <div class="h-px bg-slate-100"></div>
                }
              }
            </div>
          </div>
        }
      </div>

      <!-- Tech Stack Footer -->
      <section class="bg-slate-900 text-white rounded-3xl p-12 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-nimi-blue/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div class="relative z-10 space-y-8">
          <div class="flex flex-col md:flex-row justify-between items-center gap-8">
            <div class="space-y-2 text-center md:text-left">
              <h2 class="text-2xl font-bold">Orchestration Layer</h2>
              <p class="text-slate-400 text-sm max-w-md">
                Our platform uses LangChain and LlamaIndex to connect these models, 
                ensuring that NIMI's proprietary trade data is used as the primary source of truth.
              </p>
            </div>
            <div class="flex flex-wrap justify-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <span class="font-bold tracking-tighter text-xl italic">LangChain</span>
              <span class="font-bold tracking-tighter text-xl italic">LlamaIndex</span>
              <span class="font-bold tracking-tighter text-xl italic">Bhashini</span>
              <span class="font-bold tracking-tighter text-xl italic">Microsoft</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Integrations {
  categories = [
    { name: 'Intelligence & Drafting', icon: 'psychology' },
    { name: 'Linguistics & Translation', icon: 'translate' },
    { name: 'Media & Visualization', icon: 'auto_videocam' },
    { name: 'Assessments & Data', icon: 'analytics' }
  ];

  tools: Tool[] = [
    {
      name: 'Microsoft Copilot / Claude 3',
      category: 'Intelligence & Drafting',
      description: 'Advanced reasoning for technical manual drafting and syllabus structuring.',
      useCase: 'Curriculum Architecture',
      status: 'Integrated'
    },
    {
      name: 'Bhashini / Azure AI',
      category: 'Linguistics & Translation',
      description: 'Specialized translation for 22+ Indian languages with technical glossary support.',
      useCase: 'Regional Localization',
      status: 'Partner'
    },
    {
      name: 'HeyGen / Synthesia',
      category: 'Media & Visualization',
      description: 'AI avatar-based instructor videos for trade theory demonstrations.',
      useCase: 'Virtual Instructors',
      status: 'External'
    },
    {
      name: 'ElevenLabs / Murf.ai',
      category: 'Media & Visualization',
      description: 'High-fidelity multilingual voiceovers for instructional media.',
      useCase: 'Audio Narration',
      status: 'Integrated'
    },
    {
      name: 'PrepAI / OpenAI',
      category: 'Assessments & Data',
      description: 'Automated MCQ generation with difficulty tagging and competency mapping.',
      useCase: 'CBT Question Banks',
      status: 'Integrated'
    },
    {
      name: 'Midjourney / Stable Diffusion',
      category: 'Media & Visualization',
      description: 'Photorealistic technical illustrations and safety posters.',
      useCase: 'Technical Graphics',
      status: 'External'
    },
    {
      name: 'DeepL Pro',
      category: 'Linguistics & Translation',
      description: 'High-precision technical translation for European languages and global standards.',
      useCase: 'Global Benchmarking',
      status: 'External'
    },
    {
      name: 'Runway ML / Pika',
      category: 'Media & Visualization',
      description: 'Generative video for complex mechanical process visualizations.',
      useCase: 'Process Animation',
      status: 'External'
    },
    {
      name: 'Quizgecko',
      category: 'Assessments & Data',
      description: 'Interactive quiz generation from existing PDFs and NIMI textbooks.',
      useCase: 'Instant Assessments',
      status: 'External'
    }
  ];

  getToolsByCategory(category: string) {
    return this.tools.filter(t => t.category === category);
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Integrated': return 'bg-green-100 text-green-700';
      case 'External': return 'bg-blue-100 text-blue-700';
      case 'Partner': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  }
}
