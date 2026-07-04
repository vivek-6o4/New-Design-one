import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CaseService, SearchCriteria } from '../case.service';

@Component({
  selector: 'app-search-cases',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-cases.html',
  styleUrls: ['./search-cases.scss'],
})
export class SearchCasesComponent {
  private readonly caseService = inject(CaseService);
  
  protected readonly criteria = this.caseService.searchCriteria;
  protected readonly directions = this.caseService.directions;
  protected readonly types = this.caseService.types;
  isCollapsed = signal(false);
collapsedChange = output<boolean>();

toggleCollapse() {
  this.isCollapsed.update(v => !v);
  this.collapsedChange.emit(this.isCollapsed());
}

  updateField(key: keyof SearchCriteria, value: string) {
    this.caseService.updateCriteria(key, value);
  }

  search() {
    this.caseService.performSearch();
  }

  reset() {
    this.caseService.resetSearch();
  }
}
