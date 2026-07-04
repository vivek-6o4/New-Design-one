import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchCasesComponent } from '../search-cases/search-cases';
import { SearchResultsComponent } from '../search-results/search-results';
import { EditFieldsComponent } from '../edit-fields/edit-fields';
import { CaseDetailsComponent } from '../case-details/case-details';

@Component({
  selector: 'app-workspace',
  imports: [
    CommonModule,
    SearchCasesComponent,
    SearchResultsComponent,
    EditFieldsComponent,
    CaseDetailsComponent
  ],
  templateUrl: './workspace.html',
  styleUrls: ['./workspace.scss']
})
export class WorkspaceComponent {
  isResultsCollapsed = signal(false);
  isSearchCollapsed = signal(false);
}
