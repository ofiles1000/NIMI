import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, CommonModule],
  template: `
    <div class="min-h-screen flex flex-col">
      <!-- Navigation -->
      <nav class="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center gap-8">
              <a routerLink="/" class="flex items-center gap-2 group">
                <div class="w-10 h-10 bg-nimi-blue rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                  <mat-icon>architecture</mat-icon>
                </div>
                <div class="flex flex-col">
                  <span class="font-bold text-slate-900 leading-none">NIMI AI</span>
                  <span class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Content Architect</span>
                </div>
              </a>
              
              <div class="hidden md:flex items-center gap-1">
                <a routerLink="/" routerLinkActive="bg-slate-100 text-nimi-blue" [routerLinkActiveOptions]="{exact: true}" class="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <mat-icon class="!text-lg">home</mat-icon>
                  Overview
                </a>
                <a routerLink="/generator" routerLinkActive="bg-slate-100 text-nimi-blue" class="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <mat-icon class="!text-lg">auto_stories</mat-icon>
                  Content Generator
                </a>
                <a routerLink="/assessment" routerLinkActive="bg-slate-100 text-nimi-blue" class="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <mat-icon class="!text-lg">quiz</mat-icon>
                  Mock Tests
                </a>
                <a routerLink="/translation" routerLinkActive="bg-slate-100 text-nimi-blue" class="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <mat-icon class="!text-lg">translate</mat-icon>
                  Localization
                </a>
                <a routerLink="/media-studio" routerLinkActive="bg-slate-100 text-nimi-blue" class="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
                  <mat-icon class="!text-lg">movie_filter</mat-icon>
                  Media Studio
                </a>
              </div>
            </div>
            
            <div class="flex items-center gap-4">
              <div class="hidden lg:flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-[10px] font-bold uppercase tracking-wider">AI Engine Online</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-1">
        <router-outlet />
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-slate-200 py-8">
        <div class="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div class="flex justify-center items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
             <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Powered by Gemini 3.1 Pro</span>
          </div>
          <p class="text-xs text-slate-400">
            &copy; 2026 NIMI AI Content Architect. Designed for the Ministry of Skill Development & Entrepreneurship.
          </p>
        </div>
      </footer>
    </div>
  `,
  styleUrl: './app.css',
})
export class App {}
