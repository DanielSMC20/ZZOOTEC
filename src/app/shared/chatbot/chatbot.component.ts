import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ChatbotService,
  ChatMessage,
} from '../../core/services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="zt-root" [style.bottom.px]="isMinimized ? buttonBottom : 24">

      <!-- ── FAB Button (minimizado) ── -->
      <div *ngIf="isMinimized">
        <button
          (click)="onButtonClick()"
          (mousedown)="onDragStart($event)"
          (window:mousemove)="onDragMove($event)"
          (window:mouseup)="onDragEnd($event)"
          class="zt-fab"
          [class.zt-fab--dragging]="isDragging"
        >
          <!-- Bot icon -->
          <span class="zt-fab__icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/>
              <path d="M12 7v4"/><circle cx="8" cy="16" r="1" fill="white"/><circle cx="16" cy="16" r="1" fill="white"/>
            </svg>
          </span>
          <span class="zt-fab__label">Asistente ZOOTEC</span>
          <span class="zt-fab__dot"></span>
          <!-- GripVertical icon -->
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="2" stroke-linecap="round">
            <circle cx="9" cy="5" r="1" fill="rgba(255,255,255,0.45)"/>
            <circle cx="9" cy="12" r="1" fill="rgba(255,255,255,0.45)"/>
            <circle cx="9" cy="19" r="1" fill="rgba(255,255,255,0.45)"/>
            <circle cx="15" cy="5" r="1" fill="rgba(255,255,255,0.45)"/>
            <circle cx="15" cy="12" r="1" fill="rgba(255,255,255,0.45)"/>
            <circle cx="15" cy="19" r="1" fill="rgba(255,255,255,0.45)"/>
          </svg>
        </button>
      </div>

      <!-- ── Chat Window ── -->
      <div *ngIf="!isMinimized" class="zt-window">

        <!-- Header -->
        <div class="zt-header">
          <div class="zt-header__left">
            <span class="zt-header__avatar">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/>
                <path d="M12 7v4"/><circle cx="8" cy="16" r="1" fill="white"/><circle cx="16" cy="16" r="1" fill="white"/>
              </svg>
              <span class="zt-header__dot"></span>
            </span>
            <span>
              <div class="zt-header__title">Asistente ZOOTEC</div>
              <div class="zt-header__sub">Soporte · Análisis · Inventario</div>
            </span>
          </div>
          <div class="zt-header__actions">
            <!-- Minimizar -->
            <button class="zt-hbtn" (click)="minimizeChat()" title="Minimizar">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="2.5" stroke-linecap="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
            <!-- Limpiar -->
            <button class="zt-hbtn zt-hbtn--warn" (click)="clearChat()" title="Limpiar historial">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
            </button>
            <!-- Cerrar -->
            <button class="zt-hbtn zt-hbtn--close" (click)="closeChat()" title="Cerrar">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div class="zt-messages" #messagesContainer>

          <!-- Empty state -->
          <div *ngIf="messages.length === 0" class="zt-empty">
            <span class="zt-empty__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.522 4.82 3.889 6.205L6 20l4.447-2.724A10.6 10.6 0 0 0 12 17.23c4.97 0 9-3.185 9-7.115S16.97 3 12 3z"/>
                <path d="M8 10h.01M12 10h.01M16 10h.01"/>
              </svg>
            </span>
            <p class="zt-empty__title">¿En qué te ayudo?</p>
            <p class="zt-empty__sub">Consulta stock, ventas, alertas y más.</p>
          </div>

          <div
            *ngFor="let msg of messages"
            class="zt-row"
            [class.zt-row--user]="msg.isUser"
            [class.zt-row--bot]="!msg.isUser"
          >
            <span *ngIf="!msg.isUser" class="zt-bot-avatar">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/>
                <path d="M12 7v4"/><circle cx="8" cy="16" r="1" fill="white"/><circle cx="16" cy="16" r="1" fill="white"/>
              </svg>
            </span>
            <div
              class="zt-bubble"
              [class.zt-bubble--user]="msg.isUser"
              [class.zt-bubble--bot]="!msg.isUser"
            >
              <div [innerHTML]="formatMessage(msg.message)"></div>
              <div class="zt-bubble__time">{{ msg.timestamp | date: 'HH:mm' }}</div>
            </div>
          </div>

          <!-- Typing indicator -->
          <div *ngIf="isTyping" class="zt-row zt-row--bot">
            <span class="zt-bot-avatar">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/>
                <path d="M12 7v4"/><circle cx="8" cy="16" r="1" fill="white"/><circle cx="16" cy="16" r="1" fill="white"/>
              </svg>
            </span>
            <div class="zt-typing">
              <span></span><span></span><span></span>
            </div>
          </div>

        </div>

        <!-- Quick actions -->
        <div class="zt-quick">
          <p class="zt-quick__label">Accesos rápidos</p>
          <div class="zt-quick__chips">

            <!-- Stock bajo -->
            <button class="zt-chip zt-chip--amber" (click)="quickMessage('¿Qué productos tienen stock bajo?')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#92400e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
              Stock bajo
            </button>

            <!-- Ventas hoy -->
            <button class="zt-chip zt-chip--blue" (click)="quickMessage('¿Cuántas ventas hubo hoy?')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1e40af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              Ventas hoy
            </button>

            <!-- Ayuda -->
            <button class="zt-chip zt-chip--green" (click)="quickMessage('ayuda')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#166534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Ayuda
            </button>

          </div>
        </div>

        <!-- Input bar -->
        <div class="zt-inputbar">
          <div class="zt-inputbar__inner">
            <input
              class="zt-input"
              type="text"
              [(ngModel)]="userInput"
              (keydown.enter)="sendMessage()"
              [disabled]="isTyping"
              placeholder="Escribe un mensaje..."
              #inputField
            />
            <button
              class="zt-send"
              (click)="sendMessage()"
              [disabled]="!userInput.trim() || isTyping"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    /* ================================================================
       ZOOTEC CHATBOT — prefijo zt- en todas las clases
       SVGs inline, sin dependencia de lucide-angular
    ================================================================ */

    .zt-root {
      position: fixed;
      right: 24px;
      z-index: 9999;
      font-family: 'DM Sans', 'Nunito', 'Segoe UI', system-ui, sans-serif;
    }

    /* ── FAB ─────────────────────────────────────────────── */
    .zt-fab {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 11px 16px 11px 12px;
      border-radius: 18px;
      border: none;
      background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
      color: white;
      cursor: grab;
      user-select: none;
      box-shadow: 0 8px 28px -4px rgba(29,78,216,0.55), inset 0 0 0 1px rgba(255,255,255,0.1);
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    }
    .zt-fab:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 32px -4px rgba(29,78,216,0.65), inset 0 0 0 1px rgba(255,255,255,0.13);
    }
    .zt-fab--dragging { transform: scale(0.96); opacity: 0.85; }

    .zt-fab__icon {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.22);
      border-radius: 8px;
      flex-shrink: 0;
    }
    .zt-fab__label {
      font-size: 13.5px;
      font-weight: 600;
      letter-spacing: 0.01em;
      white-space: nowrap;
    }
    .zt-fab__dot {
      width: 7px;
      height: 7px;
      background: #4ade80;
      border-radius: 50%;
      box-shadow: 0 0 0 2.5px rgba(74,222,128,0.3);
      animation: zt-pulse 2s infinite;
      flex-shrink: 0;
    }

    /* ── Window ──────────────────────────────────────────── */
    .zt-window {
      width: 376px;
      height: min(660px, calc(100vh - 48px));
      display: flex;
      flex-direction: column;
      background: #ffffff;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 24px 64px -12px rgba(0,0,0,0.22), 0 8px 24px -4px rgba(0,0,0,0.1);
      overflow: hidden;
      animation: zt-slideUp 0.28s cubic-bezier(0.34,1.56,0.64,1);
    }
    @keyframes zt-slideUp {
      from { opacity: 0; transform: translateY(18px) scale(0.96); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* ── Header ──────────────────────────────────────────── */
    .zt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 13px 14px;
      background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%);
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
    }
    .zt-header::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 85% 15%, rgba(255,255,255,0.07) 0%, transparent 55%);
      pointer-events: none;
    }
    .zt-header__left {
      display: flex;
      align-items: center;
      gap: 11px;
      position: relative;
      z-index: 1;
    }
    .zt-header__avatar {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.14);
      border: 1.5px solid rgba(255,255,255,0.24);
      border-radius: 10px;
      flex-shrink: 0;
      position: relative;
    }
    .zt-header__dot {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 10px;
      height: 10px;
      background: #4ade80;
      border-radius: 50%;
      border: 2px solid #1e3a8a;
      animation: zt-pulse 2s infinite;
    }
    .zt-header__title {
      font-size: 13.5px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.01em;
      line-height: 1.3;
    }
    .zt-header__sub {
      font-size: 11px;
      color: rgba(255,255,255,0.55);
      letter-spacing: 0.02em;
      margin-top: 1px;
    }
    .zt-header__actions {
      display: flex;
      align-items: center;
      gap: 4px;
      position: relative;
      z-index: 1;
    }

    .zt-hbtn {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      cursor: pointer;
      padding: 0;
      transition: background 0.14s, transform 0.1s;
    }
    .zt-hbtn:hover        { background: rgba(255,255,255,0.2); transform: scale(1.06); }
    .zt-hbtn:active       { transform: scale(0.93); }
    .zt-hbtn--warn:hover  { background: rgba(251,146,60,0.35); }
    .zt-hbtn--close:hover { background: rgba(239,68,68,0.45); }

    /* ── Messages ────────────────────────────────────────── */
    .zt-messages {
      flex: 1;
      overflow-y: auto;
      padding: 14px;
      background: #f8fafc;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scroll-behavior: smooth;
    }
    .zt-messages::-webkit-scrollbar       { width: 4px; }
    .zt-messages::-webkit-scrollbar-track { background: transparent; }
    .zt-messages::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }

    .zt-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 36px 20px;
      text-align: center;
    }
    .zt-empty__icon {
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #dbeafe, #eff6ff);
      border: 1px solid #bfdbfe;
      border-radius: 16px;
      margin-bottom: 12px;
    }
    .zt-empty__title { font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 4px; }
    .zt-empty__sub   { font-size: 12.5px; color: #64748b; margin: 0; }

    .zt-row {
      display: flex;
      align-items: flex-end;
      gap: 7px;
    }
    .zt-row--user { justify-content: flex-end; }
    .zt-row--bot  { justify-content: flex-start; }

    .zt-bot-avatar {
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1e3a8a, #1d4ed8);
      border-radius: 8px;
      flex-shrink: 0;
    }

    .zt-bubble {
      max-width: 80%;
      padding: 10px 13px;
      border-radius: 16px;
      font-size: 13.5px;
      line-height: 1.55;
      word-break: break-word;
      animation: zt-bubbleIn 0.2s ease;
    }
    @keyframes zt-bubbleIn {
      from { opacity: 0; transform: translateY(5px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .zt-bubble--user {
      background: linear-gradient(135deg, #1d4ed8, #3b82f6);
      color: #ffffff;
      border-bottom-right-radius: 4px;
      box-shadow: 0 2px 12px -2px rgba(29,78,216,0.4);
    }
    .zt-bubble--bot {
      background: #ffffff;
      color: #0f172a;
      border: 1px solid #e2e8f0;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }
    .zt-bubble__time {
      font-size: 10px;
      margin-top: 5px;
      opacity: 0.5;
    }
    .zt-bubble--user .zt-bubble__time { text-align: right; color: rgba(255,255,255,0.8); }
    .zt-bubble--bot  .zt-bubble__time { text-align: left;  color: #94a3b8; }

    .zt-typing {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 10px 14px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }
    .zt-typing span {
      width: 6px;
      height: 6px;
      background: #3b82f6;
      border-radius: 50%;
      animation: zt-typingBounce 1.2s infinite;
      display: block;
    }
    .zt-typing span:nth-child(2) { animation-delay: 0.14s; }
    .zt-typing span:nth-child(3) { animation-delay: 0.28s; }
    @keyframes zt-typingBounce {
      0%,60%,100% { transform: translateY(0);   opacity: 0.35; }
      30%         { transform: translateY(-5px); opacity: 1;    }
    }

    /* ── Quick actions ───────────────────────────────────── */
    .zt-quick {
      padding: 10px 14px 8px;
      border-top: 1px solid #e2e8f0;
      background: #ffffff;
      flex-shrink: 0;
    }
    .zt-quick__label {
      font-size: 10px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.09em;
      margin: 0 0 6px;
    }
    .zt-quick__chips {
      display: flex;
      gap: 7px;
    }
    .zt-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 10px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      transition: transform 0.12s, box-shadow 0.12s;
      font-family: inherit;
      line-height: 1;
    }
    .zt-chip:hover  { transform: translateY(-1px); box-shadow: 0 4px 10px -2px rgba(0,0,0,0.12); }
    .zt-chip:active { transform: scale(0.96); }
    .zt-chip--amber { background: #fef3c7; color: #92400e; border: 1px solid #fcd34d; }
    .zt-chip--blue  { background: #dbeafe; color: #1e40af; border: 1px solid #93c5fd; }
    .zt-chip--green { background: #dcfce7; color: #166534; border: 1px solid #86efac; }

    /* ── Input bar ───────────────────────────────────────── */
    .zt-inputbar {
      padding: 10px 12px;
      border-top: 1px solid #e2e8f0;
      background: #ffffff;
      border-radius: 0 0 19px 19px;
      flex-shrink: 0;
    }
    .zt-inputbar__inner {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f1f5f9;
      border: 1.5px solid #e2e8f0;
      border-radius: 13px;
      padding: 4px 4px 4px 13px;
      transition: border-color 0.18s, box-shadow 0.18s;
    }
    .zt-inputbar__inner:focus-within {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
    }
    .zt-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      font-size: 13.5px;
      color: #0f172a;
      font-family: inherit;
      padding: 7px 0;
    }
    .zt-input::placeholder { color: #94a3b8; }
    .zt-input:disabled     { opacity: 0.5; }

    .zt-send {
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1d4ed8, #3b82f6);
      border: none;
      border-radius: 10px;
      cursor: pointer;
      flex-shrink: 0;
      box-shadow: 0 2px 8px -2px rgba(29,78,216,0.45);
      transition: transform 0.12s, box-shadow 0.12s, opacity 0.15s;
    }
    .zt-send:hover:not(:disabled)  { transform: scale(1.07); box-shadow: 0 4px 14px -2px rgba(29,78,216,0.55); }
    .zt-send:active:not(:disabled) { transform: scale(0.94); }
    .zt-send:disabled { opacity: 0.35; cursor: not-allowed; box-shadow: none; }

    /* ── Keyframes ───────────────────────────────────────── */
    @keyframes zt-pulse {
      0%,100% { opacity: 1;    transform: scale(1);    }
      50%     { opacity: 0.65; transform: scale(0.82); }
    }
  `],
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('inputField') private inputField!: ElementRef;

  messages: ChatMessage[] = [];
  userInput: string = '';
  isTyping: boolean = false;
  isMinimized: boolean = false;
  private shouldScrollToBottom = false;

  // Drag & Drop
  isDragging: boolean = false;
  private dragStartY: number = 0;
  private dragStartX: number = 0;
  private buttonStartBottom: number = 24;
  private dragDistance: number = 0;
  buttonBottom: number = 24;

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit() {
    this.chatbotService.messages$.subscribe((messages) => {
      this.messages = messages;
      this.shouldScrollToBottom = true;
    });
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  sendMessage() {
    const message = this.userInput.trim();
    if (!message || this.isTyping) return;
    this.isTyping = true;
    this.userInput = '';
    this.chatbotService.sendMessage(message).subscribe({
      next: () => { this.isTyping = false; this.focusInput(); },
      error: () => { this.isTyping = false; this.focusInput(); },
    });
  }

  quickMessage(message: string) {
    this.userInput = message;
    this.sendMessage();
  }

  toggleChat() {
    this.isMinimized = !this.isMinimized;
    if (!this.isMinimized) setTimeout(() => this.focusInput(), 120);
  }

  minimizeChat() { this.isMinimized = true; }
  closeChat()    { this.isMinimized = true; }

  onButtonClick() {
    if (this.dragDistance < 5) this.toggleChat();
  }

  clearChat() {
    if (confirm('¿Limpiar el historial de chat?')) {
      this.chatbotService.clearHistory();
    }
  }

  formatMessage(message: string): string {
    if (typeof message !== 'string') {
      try { message = JSON.stringify(message); } catch { message = String(message); }
    }
    return message
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  private scrollToBottom() {
    try {
      if (this.messagesContainer) {
        const el = this.messagesContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    } catch (e) {}
  }

  private focusInput() {
    if (this.inputField) this.inputField.nativeElement.focus();
  }

  onDragStart(event: MouseEvent) {
    if (!this.isMinimized) return;
    this.isDragging = true;
    this.dragStartY = event.clientY;
    this.dragStartX = event.clientX;
    this.buttonStartBottom = this.buttonBottom;
    this.dragDistance = 0;
    event.preventDefault();
  }

  onDragMove(event: MouseEvent) {
    if (!this.isDragging) return;
    const deltaY = this.dragStartY - event.clientY;
    const deltaX = Math.abs(this.dragStartX - event.clientX);
    this.dragDistance = Math.sqrt(deltaY * deltaY + deltaX * deltaX);
    const newBottom = this.buttonStartBottom + deltaY;
    this.buttonBottom = Math.max(20, Math.min(newBottom, window.innerHeight - 100));
  }

  onDragEnd(_event: MouseEvent) {
    this.isDragging = false;
  }
}