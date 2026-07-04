import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseService, CaseResult } from '../case.service';

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

toggleCollapse() {
  this.isCollapsed.update(v => !v);
  this.collapsedChange.emit(this.isCollapsed());
}

  selectCase(item: CaseResult) {
    this.caseService.selectedCase.set(item);
  }

  viewLetter(item: CaseResult, event: Event) {
    event.stopPropagation(); // Avoid triggering row selection twice
    this.caseService.selectedCase.set(item);
    
    // Automatically select violation letter template if not set
    if (!this.caseService.selectedTemplate()) {
      this.caseService.setTemplate('Notice of Violation Letter');
    }
  }
}
