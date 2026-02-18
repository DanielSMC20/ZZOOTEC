import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ChatMessage {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatResponse {
  response: string;
  intent: string;
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private iaUrl = environment.iaApiUrl || 'http://localhost:8000';

  // Historial de conversación
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([
    {
      message:
        'Hola, soy el asistente virtual de ZOOTEC. ¿En qué puedo ayudarte?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  public messages$ = this.messagesSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Enviar mensaje al chatbot
   */
  sendMessage(message: string): Observable<ChatResponse> {
    // Agregar mensaje del usuario
    this.addMessage(message, true);

    // Enviar al backend IA
    return new Observable((observer) => {
      this.http
        .post<ChatResponse>(`${this.iaUrl}/api/chat`, { message })
        .subscribe({
          next: (response) => {
            // Agregar respuesta del bot
            this.addMessage(response.response, false);
            observer.next(response);
            observer.complete();
          },
          error: (error) => {
            const errorMsg =
              error.status === 503
                ? 'Error: No se pudo conectar con el servidor. Verifica que el backend esté funcionando.'
                : 'Error: No se pudo procesar el mensaje. Por favor, intenta nuevamente.';

            this.addMessage(errorMsg, false);
            observer.error(error);
          },
        });
    });
  }

  /**
   * Agregar mensaje al historial
   */
  private addMessage(message: string, isUser: boolean) {
    const currentMessages = this.messagesSubject.value;
    const newMessage: ChatMessage = {
      message,
      isUser,
      timestamp: new Date(),
    };

    this.messagesSubject.next([...currentMessages, newMessage]);
  }

  /**
   * Limpiar historial de chat
   */
  clearHistory() {
    this.messagesSubject.next([
      {
        message:
          'Hola, soy el asistente virtual de ZOOTEC. ¿En qué puedo ayudarte?',
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  }

  /**
   * Obtener mensajes actuales
   */
  getMessages(): ChatMessage[] {
    return this.messagesSubject.value;
  }

  /**
   * Verificar health del chatbot
   */
  checkHealth(): Observable<any> {
    return this.http.get(`${this.iaUrl}/api/chat/health`);
  }
}
