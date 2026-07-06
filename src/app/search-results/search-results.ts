import { Component, inject, output, signal, computed } from '@angular/core';
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
  hoveredRowId = signal<any | null>(null);

  // NEW: global filter text, like a DataTables search box
  filterText = signal<string>('');

  // NEW: filters across every column shown in the table
  protected readonly filteredResults = computed(() => {
    const term = this.filterText().trim().toLowerCase();
    const all = this.results();

    if (!term) return all;

    return all.filter((item: any) => {
      const addr = item?.caseaddress;
      const addressStr = [
        addr?.streetNumber,
        addr?.streetDirection,
        addr?.streetName,
        addr?.streetType,
        addr?.unitNumber?.trim() ? `#${addr.unitNumber.trim()}` : '',
        addr?.city,
        addr?.state,
        addr?.zip
      ].filter(Boolean).join(' ').toLowerCase();

      const searchableFields = [
        item?.caseNumber,
        addressStr,
        item?.programcode,
        this.getStatusLabel(item?.casestatus),
        item?.opendate,
        item?.closedate,
        item?.inspector1id,
        item?.inspector2id,
        item?.description
      ];

      return searchableFields
        .filter(f => f !== null && f !== undefined)
        .some(f => String(f).toLowerCase().includes(term));
    });
  });

  onFilterInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterText.set(value);
  }

  toggleCollapse() {
    this.isCollapsed.update(v => !v);
    this.collapsedChange.emit(this.isCollapsed());
  }

  selectCase(item: any) {
    this.caseService.selectedCase.set(item);
  }

  getStatusLabel(code: string): string {
    if (code === 'O') return 'Open';
    if (code === 'C') return 'Closed';
    return code ?? 'Unknown';
  }

  getStatusClass(code: string): string {
    if (code === 'O') return 'open';
    if (code === 'C') return 'closed';
    return 'pending';
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