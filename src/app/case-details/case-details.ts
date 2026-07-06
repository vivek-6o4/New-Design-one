import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CaseService } from '../case.service';

@Component({
  selector: 'app-case-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './case-detail.html',
  styleUrls: ['./case-detail.scss'],
})
export class CaseDetailsComponent {
  private readonly caseService = inject(CaseService);
  protected readonly selectedCase = this.caseService.selectedCase;

  closePanel() {
    this.caseService.selectedCase.set(null);
  }

  isCollapsed = signal(false);

toggleCollapse() {
  this.isCollapsed.update(v => !v);
}

formatAddress(item: any): string {
  const a = item?.caseaddress;
  if (!a) return '';
  const unit = a.unitNumber?.trim() ? ` #${a.unitNumber.trim()}` : '';
  const line1 = `${a.streetNumber} ${a.streetDirection ?? ''} ${a.streetName} ${a.streetType}${unit}`.replace(/\s+/g, ' ').trim();
  return `${line1}`;
}
}
