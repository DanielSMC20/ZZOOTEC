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
import {
  LucideAngularModule,
  Bot,
  Package,
  TrendingUp,
  HelpCircle,
  Trash2,
  Minimize2,
  Send,
  GripVertical,
} from 'lucide-angular';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div
      class="fixed right-6 z-50"
      [style.bottom.px]="isMinimized ? buttonBottom : 20"
    >
      <!-- Toggle Button (minimized) -->
      <div *ngIf="isMinimized" class="flex items-end justify-end">
        <button
          (click)="onButtonClick()"
          (mousedown)="onDragStart($event)"
          (window:mousemove)="onDragMove($event)"
          (window:mouseup)="onDragEnd($event)"
          [class.opacity-80]="isDragging"
          class="flex items-center gap-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white px-4 py-3 rounded-full shadow-2xl border-2 border-slate-600 hover:scale-[1.05] transform transition-all cursor-grab font-semibold hover:border-white"
        >
          <lucide-icon name="bot" class="w-5 h-5"></lucide-icon>
          <span class="font-semibold">Asistente ZOOTEC</span>
          <span
            class="ml-2 h-2 w-2 bg-emerald-400 rounded-full animate-pulse"
          ></span>
          <lucide-icon
            name="grip-vertical"
            class="w-4 h-4 opacity-60 ml-2"
          ></lucide-icon>
        </button>
      </div>

      <!-- Chat Window -->
      <div
        *ngIf="!isMinimized"
        class="w-96 h-screen max-h-[720px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-4 py-3 bg-slate-800 text-white"
        >
          <div class="flex items-center gap-2.5 flex-1 min-w-0">
            <div
              class="h-2 w-2 bg-cyan-300 rounded-full animate-pulse flex-shrink-0"
            ></div>
            <lucide-icon
              name="bot"
              class="w-4 h-4 flex-shrink-0 text-gray-50"
            ></lucide-icon>
            <div class="min-w-0">
              <div class="font-semibold text-sm leading-tight text-gray-50">
                Asistente ZOOTEC
              </div>
              <div class="text-xs text-gray-200 truncate">
                Soporte y análisis
              </div>
            </div>
          </div>

          <!-- Visible actions: limpiar, minimizar y cerrar -->
          <div class="flex items-center gap-1.5 ml-2 flex-shrink-0">
            <button
              (click)="clearChat()"
              title="Limpiar chat"
              class="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition"
            >
              <lucide-icon
                name="trash-2"
                class="w-4 h-4 text-gray-100"
              ></lucide-icon>
            </button>
            <button
              (click)="toggleChat()"
              title="Minimizar"
              class="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition"
            >
              <lucide-icon
                name="minimize-2"
                class="w-4 h-4 text-gray-100"
              ></lucide-icon>
            </button>
            <button
              (click)="toggleChat()"
              title="Cerrar"
              class="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition"
            >
              <lucide-icon name="x" class="w-4 h-4 text-gray-100"></lucide-icon>
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div
          class="flex-1 overflow-y-auto p-3 bg-white space-y-2"
          #messagesContainer
        >
          <div
            *ngFor="let msg of messages"
            class="flex"
            [ngClass]="{
              'justify-end': msg.isUser,
              'justify-start': !msg.isUser,
            }"
          >
            <div
              [ngClass]="{
                'bg-blue-600 text-white rounded-lg rounded-br-none px-3 py-2 max-w-[85%] text-sm font-medium':
                  msg.isUser,
                'bg-gray-100 border border-gray-300 rounded-lg rounded-bl-none px-3 py-2 max-w-[85%] text-sm text-gray-900':
                  !msg.isUser,
              }"
            >
              <div [innerHTML]="formatMessage(msg.message)"></div>
              <div
                [ngClass]="{
                  'text-[10px] opacity-60 mt-1 text-right': msg.isUser,
                  'text-[10px] opacity-60 mt-1 text-left': !msg.isUser,
                }"
              >
                {{ msg.timestamp | date: 'HH:mm' }}
              </div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div *ngIf="isTyping" class="flex">
            <div
              class="inline-flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
            >
              <span
                class="dot w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce delay-75"
              ></span>
              <span
                class="dot w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce delay-150"
              ></span>
              <span
                class="dot w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce delay-200"
              ></span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div
          class="px-3 py-2 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto items-center"
        >
          <button
            (click)="quickMessage('¿Qué productos tienen stock bajo?')"
            class="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs hover:bg-amber-50 transition flex-shrink-0"
          >
            <lucide-icon
              name="package"
              class="w-3 h-3 text-slate-600"
            ></lucide-icon>
            <span class="whitespace-nowrap text-slate-600">Stock bajo</span>
          </button>
          <button
            (click)="quickMessage('¿Cuántas ventas hubo hoy?')"
            class="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs hover:bg-amber-50 transition flex-shrink-0"
          >
            <lucide-icon
              name="trending-up"
              class="w-3 h-3 text-slate-600"
            ></lucide-icon>
            <span class="whitespace-nowrap text-slate-600">Ventas hoy</span>
          </button>
          <button
            (click)="quickMessage('ayuda')"
            class="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs hover:bg-amber-50 transition flex-shrink-0"
          >
            <lucide-icon
              name="help-circle"
              class="w-3 h-3 text-slate-600"
            ></lucide-icon>
            <span class="whitespace-nowrap text-slate-600">Ayuda</span>
          </button>
        </div>

        <!-- Input -->
        <div
          class="px-3 py-3 bg-white border-t border-gray-100 flex items-center gap-2"
        >
          <input
            type="text"
            [(ngModel)]="userInput"
            (keydown.enter)="sendMessage()"
            [disabled]="isTyping"
            placeholder="Escribe..."
            class="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-500"
            #inputField
          />
          <button
            (click)="sendMessage()"
            [disabled]="!userInput.trim() || isTyping"
            class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition"
          >
            <lucide-icon name="send" class="w-5 h-5 text-white"></lucide-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* Small custom animations that complement Tailwind */
      .dot {
        animation: typingDots 1.2s infinite;
      }
      .dot.delay-75 {
        animation-delay: 0.08s;
      }
      .dot.delay-150 {
        animation-delay: 0.16s;
      }
      .dot.delay-200 {
        animation-delay: 0.24s;
      }
      @keyframes typingDots {
        0% {
          transform: translateY(0);
          opacity: 0.3;
        }
        50% {
          transform: translateY(-4px);
          opacity: 1;
        }
        100% {
          transform: translateY(0);
          opacity: 0.3;
        }
      }
      .animate-bounce {
        animation: typingDots 1s infinite;
      }
      /* Ensure messages container scrolls smoothly */
      :host ::ng-deep .scroll-smooth {
        scroll-behavior: smooth;
      }
    `,
  ],
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('inputField') private inputField!: ElementRef;

  messages: ChatMessage[] = [];
  userInput: string = '';
  isTyping: boolean = false;
  isMinimized: boolean = false;
  private shouldScrollToBottom = false;

  // Drag & Drop properties
  isDragging: boolean = false;
  private dragStartY: number = 0;
  private dragStartX: number = 0;
  private buttonStartBottom: number = 20;
  private dragDistance: number = 0;
  buttonBottom: number = 20; // Position from bottom in pixels

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit() {
    // Suscribirse al historial de mensajes
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
      next: () => {
        this.isTyping = false;
        this.focusInput();
      },
      error: () => {
        this.isTyping = false;
        this.focusInput();
      },
    });
  }

  quickMessage(message: string) {
    this.userInput = message;
    this.sendMessage();
  }

  toggleChat() {
    this.isMinimized = !this.isMinimized;
    if (!this.isMinimized) {
      setTimeout(() => this.focusInput(), 100);
    }
  }

  onButtonClick() {
    // Solo ejecutar toggleChat si no hubo drag significativo
    if (this.dragDistance < 5) {
      this.toggleChat();
    }
  }

  clearChat() {
    if (confirm('¿Limpiar el historial de chat?')) {
      this.chatbotService.clearHistory();
    }
  }

  formatMessage(message: string): string {
    // Convertir markdown simple a HTML
    return message
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  private scrollToBottom() {
    try {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  private focusInput() {
    if (this.inputField) {
      this.inputField.nativeElement.focus();
    }
  }

  // ============================================
  // DRAG & DROP FUNCTIONALITY
  // ============================================

  onDragStart(event: MouseEvent) {
    if (!this.isMinimized) return; // Solo mover cuando está minimizado

    this.isDragging = true;
    this.dragStartY = event.clientY;
    this.dragStartX = event.clientX;
    this.buttonStartBottom = this.buttonBottom;
    this.dragDistance = 0;

    event.preventDefault();
  }

  onDragMove(event: MouseEvent) {
    if (!this.isDragging) return;

    const deltaY = this.dragStartY - event.clientY; // Invertido porque bottom crece hacia arriba
    const deltaX = Math.abs(this.dragStartX - event.clientX);
    this.dragDistance = Math.sqrt(deltaY * deltaY + deltaX * deltaX);

    let newBottom = this.buttonStartBottom + deltaY;

    // Limitar el movimiento (mínimo 20px, máximo altura de ventana - 80px)
    const maxBottom = window.innerHeight - 100;
    newBottom = Math.max(20, Math.min(newBottom, maxBottom));

    this.buttonBottom = newBottom;
  }

  onDragEnd(event: MouseEvent) {
    this.isDragging = false;
  }
}
