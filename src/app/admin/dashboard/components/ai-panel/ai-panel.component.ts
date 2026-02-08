import { HttpClient } from "@angular/common/http";
import { Component, Injectable, Input } from "@angular/core";
import { environment } from "../../../../../environments/environment";
import { CommonModule } from "@angular/common";


import { LucideAngularModule, Sparkles } from 'lucide-angular';



@Injectable({ providedIn: 'root' })
@Component({
  selector: 'app-ai-panel',
  standalone: true,
  imports: [CommonModule, LucideAngularModule
  ],
  templateUrl: './ai-panel.component.html'
})
export class AiPanelComponent {


  icons = {
  ai: Sparkles
  };
  @Input() preference: any;
  @Input() promotions: any[] = [];

  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPreferences(clientId: number) {
    return this.http.get(`${this.api}/ai/preferences/${clientId}`);
  }

  getPromotions() {
    return this.http.get(`${this.api}/ai/promotions`);
  }
}
