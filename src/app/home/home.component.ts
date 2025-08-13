import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PadsService } from '../services/pads.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  content = '';
  showDialog = false;
  shareLink = '';
  padId: string | null = null;

  constructor(private pads: PadsService, private router: Router) {}

  async ngOnInit() {
    // Check if we have an existing pad for this session
    this.padId = sessionStorage.getItem('padId');
    if (this.padId) {
      const pad = await this.pads.getPad(this.padId);
      this.content = pad.content;

      // Optional: Subscribe to changes so it stays updated live
      this.pads.subscribePad(this.padId, newContent => {
        this.content = newContent;
      });
    }
  }

  async openDialog() {
    if (!this.content.trim()) return;

    if (!this.padId) {
      // Create new pad and store ID in session
      const pad = await this.pads.createPad(this.content);
      this.padId =pad.id as string;
      sessionStorage.setItem('padId', this.padId);
    } else {
      // Update existing pad
      await this.pads.updatePad(this.padId, this.content);
    }

    this.shareLink = `${window.location.origin}/pad/${this.padId}`;
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
  }

  copyLink() {
    navigator.clipboard.writeText(this.shareLink);
  }
}
