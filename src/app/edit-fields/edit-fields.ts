import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CaseService } from '../case.service';

@Component({
  selector: 'app-edit-fields',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-fields.html',
  styleUrls: ['./edit-fields.scss'],
})
export class EditFieldsComponent {
  private readonly caseService = inject(CaseService);
  protected readonly selectedCase = this.caseService.selectedCase;
  isCollapsed = signal(false);

  actionValue = signal<string>('');
  routeToValue = signal<string>('');
  dateValue = signal<string>('');
  commentsValue = signal<string>('');

  actionError = signal<string | null>(null);
  routeToError = signal<string | null>(null);

  // NEW: success banner state
  successUrl = signal<string | null>(null);

  private readonly letterUrl =
    'https://codex2024.sharepoint.com/:w:/r/sites/sharepoint/_layouts/15/doc2.aspx?sourcedoc=%7B9F03956D-1E6D-491E-9A57-112BE448BCFB%7D&file=File_2913.docx&action=default&mobileredirect=true';

  toggleCollapse() {
    this.isCollapsed.update(v => !v);
  }

  closePanel() {
    this.caseService.selectedCase.set(null);
  }

  goBack() {
    this.closePanel();
  }

  createLetter() {
    // Reset errors and any previous success message on every attempt
    this.actionError.set(null);
    this.routeToError.set(null);
    this.successUrl.set(null);

    let hasError = false;

    if (!this.actionValue()) {
      this.actionError.set('Please select an action.');
      hasError = true;
    }

    if (!this.routeToValue()) {
      this.routeToError.set('Please select a user to route to.');
      hasError = true;
    }

    if (hasError) {
      return; // stop here — do not proceed with letter creation
    }

    // Open the letter document in a new tab
    window.open(this.letterUrl, '_blank');

    // Show inline success banner instead of alert()
    this.successUrl.set(this.letterUrl);

    // Optional: reset form after successful creation
    // this.actionValue.set('');
    // this.routeToValue.set('');
    // this.dateValue.set('');
    // this.commentsValue.set('');
    // this.caseService.resetSearch();
  }

  dismissSuccess() {
    this.successUrl.set(null);
  }
}