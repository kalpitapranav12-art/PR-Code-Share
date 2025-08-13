import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PadsService } from '../services/pads.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pad.component.html',
  styleUrls: ['./pad.component.scss']
})
export class PadComponent implements OnInit, OnDestroy {
  content = '';
  padId!: string;
  sub: any;

  constructor(
    private route: ActivatedRoute,
    private pads: PadsService
  ) {}

  async ngOnInit() {
    this.padId = this.route.snapshot.paramMap.get('id')!;

    // Load initial content
    const pad = await this.pads.getPad(this.padId);
    this.content = pad.content;

    // Subscribe to changes from Supabase
    this.sub = this.pads.subscribePad(this.padId, (newContent: string) => {
      this.content = newContent;
    });
  }

  async save() {
    await this.pads.updatePad(this.padId, this.content);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.pads.removeSubscription(this.sub);
    }
  }
}
