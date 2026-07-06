import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseService } from '../case.service';

@Component({
  selector: 'app-search-results',
  imports: [CommonModule],
  templateUrl: './search-results.html',
  styleUrls: ['./search-results.scss']
})
export class SearchResultsComponent {
  private readonly caseService = inject(CaseService);

  protected readonly results = this.caseService.searchResults;
  protected readonly selectedCase = this.caseService.selectedCase;

  isCollapsed = signal(false);
  collapsedChange = output<boolean>();

  private readonly statusMap: Record<string, string> = {
    O: 'Open',
    C: 'Closed',
    P: 'Pending',
  };

  toggleCollapse() {
    this.isCollapsed.update(v => !v);
    this.collapsedChange.emit(this.isCollapsed());
  }

  selectCase(item: any) {
    this.caseService.selectedCase.set(item);
  }

  getStatusLabel(code: string): string {
    return this.statusMap[code] ?? code ?? 'Unknown';
  }

  getStatusClass(code: string): string {
    return this.getStatusLabel(code).toLowerCase();
  }

  getLatestLetterUrl(item: any): string | null {
    if (!item?.caseActions?.length) return null;
    const latest = [...item.caseActions].sort(
      (a: any, b: any) => new Date(b.actionDate).getTime() - new Date(a.actionDate).getTime()
    )[0];
    return latest?.caseActionFiles?.[0]?.physicalfilename ?? null;
  }

  viewLetter(item: any, event: Event) {
    event.stopPropagation();
    this.caseService.selectedCase.set(item);

    const url = this.getLatestLetterUrl(item);
    if (url) {
      window.open(url, '_blank');
    }

    if (!this.caseService.selectedTemplate()) {
      this.caseService.setTemplate('Notice of Violation Letter');
    }
  }
}