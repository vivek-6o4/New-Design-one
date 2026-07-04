import { Component, inject } from '@angular/core';
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

  closePanel() {
    this.caseService.selectedCase.set(null);
  }

  goBack() {
    this.closePanel();
  }

  createLetter() {
    alert('Letter creation initiated for Case #' + this.selectedCase()?.caseNo);
  }
}
