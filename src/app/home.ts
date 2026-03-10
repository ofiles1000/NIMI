import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatIconModule, RouterLink],
  template: `
    <div class="max-w-6xl mx-auto py-12 px-4 space-y-24">
      <!-- Hero Section -->
      <section class="text-center space-y-6">
        <h1 class="text-6xl font-bold tracking-tight text-slate-900">
          Empowering <span class="gradient-text">NIMI</span> with <br/>
          Generative AI
        </h1>
        <p class="text-xl text-slate-600 max-w-3xl mx-auto">
          Accelerating vocational excellence through automated content creation, 
          intelligent translation, and standardized assessment for CTS/CITS.
        </p>
        <div class="flex justify-center gap-4 pt-8">
          <div class="flex items-center gap-2 px-4 py-2 bg-nimi-blue text-white rounded-full shadow-lg">
            <mat-icon>verified</mat-icon>
            <span class="font-medium text-sm uppercase tracking-wider">DGT / MSDE Initiative</span>
          </div>
        </div>
      </section>

      <!-- PPT Style Slides -->
      <div class="space-y-16">
        @for (slide of slides; track slide.title) {
          <div class="ppt-slide group hover:shadow-2xl transition-all duration-500">
            <div class="grid md:grid-cols-2 gap-12 items-center">
              <div class="space-y-6">
                <div class="inline-flex items-center gap-2 text-nimi-orange font-bold uppercase tracking-widest text-sm">
                  <mat-icon>{{ slide.icon }}</mat-icon>
                  <span>{{ slide.category }}</span>
                </div>
                <h2 class="text-4xl font-serif font-bold text-slate-800 leading-tight">
                  {{ slide.title }}
                </h2>
                <p class="text-lg text-slate-600 leading-relaxed">
                  {{ slide.description }}
                </p>
                <ul class="space-y-3">
                  @for (point of slide.points; track point) {
                    <li class="flex items-start gap-3 text-slate-700">
                      <mat-icon class="text-green-500 mt-1">check_circle</mat-icon>
                      <span>{{ point }}</span>
                    </li>
                  }
                </ul>
                <div class="pt-4">
                  <a [routerLink]="slide.link" class="inline-flex items-center gap-2 px-6 py-2 border-2 border-nimi-blue text-nimi-blue font-bold rounded-xl hover:bg-nimi-blue hover:text-white transition-all">
                    Explore Tool
                    <mat-icon>arrow_forward</mat-icon>
                  </a>
                </div>
              </div>
              <div class="relative aspect-video bg-slate-100 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center p-8">
                <div class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-nimi-blue to-transparent"></div>
                <mat-icon class="!text-8xl text-nimi-blue/20">{{ slide.icon }}</mat-icon>
                <div class="absolute bottom-4 right-4 text-xs font-mono text-slate-400">
                  Slide {{ $index + 1 }} / {{ slides.length }}
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Call to Action -->
      <section class="bg-nimi-blue text-white rounded-3xl p-12 text-center space-y-8 shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
        
        <h2 class="text-3xl font-bold">Ready to transform vocational content?</h2>
        <p class="text-blue-100 max-w-2xl mx-auto">
          Explore the AI tools designed specifically for NIMI's ecosystem of ITIs and vocational training centers.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <button routerLink="/generator" class="px-8 py-3 bg-white text-nimi-blue font-bold rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2">
            <mat-icon>auto_awesome</mat-icon>
            Start Generating
          </button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
  slides = [
    {
      category: "Content Creation",
      title: "Automated Instructional Media Development",
      icon: "menu_book",
      link: "/generator",
      description: "AI can draft Trade Theory and Trade Practical manuals based on NCVT curriculum standards in seconds, ensuring consistency and technical accuracy.",
      points: [
        "Instant syllabus-to-textbook conversion",
        "Standardized technical terminology",
        "Structured learning objectives and outcomes",
        "Automated formatting for print and digital"
      ]
    },
    {
      category: "Digital Media",
      title: "Digital Media Studio: 2D, 3D & Video",
      icon: "movie_filter",
      link: "/media-studio",
      description: "Generate professional scripts for demo videos, storyboards for 3D animations, and prompts for 2D technical graphics.",
      points: [
        "Scene-by-scene video script generation",
        "3D animation storyboards for complex parts",
        "AI prompts for 2D technical diagrams",
        "Interactive simulation logic design"
      ]
    },
    {
      category: "Assessment",
      title: "CTS/CITS Question Bank Architect",
      icon: "quiz",
      link: "/assessment",
      description: "Generate large-scale, high-quality question banks with automatic difficulty tagging and competency mapping.",
      points: [
        "Automatic difficulty level tagging (Easy/Med/Hard)",
        "Competency mapping (Knowledge/Application)",
        "Large-scale question bank generation",
        "Detailed technical explanations for CBT"
      ]
    },
    {
      category: "Localization",
      title: "Technical Translation & Regional Reach",
      icon: "translate",
      link: "/translation",
      description: "Break language barriers by translating complex technical content into Hindi and regional languages while maintaining technical integrity.",
      points: [
        "Context-aware technical translation",
        "Regional language localization for ITIs",
        "Glossary-consistent terminology",
        "Multi-lingual mock test support"
      ]
    },
    {
      category: "Ecosystem",
      title: "AI Ecosystem & Prompt Architect",
      icon: "hub",
      link: "/ecosystem",
      description: "Generate optimized prompts for external AI tools like NotebookLM, Claude, and ElevenLabs to enhance your NIMI content production.",
      points: [
        "NotebookLM & Claude prompt engineering",
        "Bhashini & Azure translation prompts",
        "Synthesia & HeyGen video scripts",
        "ElevenLabs & Midjourney technical prompts"
      ]
    },
    {
      category: "Integration",
      title: "NIMI Power Stack: Best-in-Class AI",
      icon: "settings_input_component",
      link: "/integrations",
      description: "Explore the full stack of AI tools integrated or partnered with NIMI to deliver world-class vocational training.",
      points: [
        "Multi-model orchestration (Gemini, Claude, GPT)",
        "Linguistic excellence (Bhashini, Azure)",
        "Media & Avatar production (HeyGen, Synthesia)",
        "Assessment intelligence (PrepAI, Quizgecko)"
      ]
    }
  ];
}
