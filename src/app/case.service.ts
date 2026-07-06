import { Injectable, signal, computed } from '@angular/core';
import mockCaseData from '../data/CaseSearch.json';

export interface DocumentFile {
  id: string;
  name: string;
  pdfUrl?: string;
  checked: boolean;
}

export interface SearchCriteria {
  caseNo: string;
  streetNo: string;
  direction: string;
  streetName: string;
  type: string;
  unitNo: string;
  apn: string;
}

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  // Documents state
  readonly documents = signal<DocumentFile[]>([
    { id: '20932', name: 'sf dharshan (3).pdf', checked: true },
    { id: '20933', name: 'sf dharshan (2).pdf', checked: false },
    { id: '20934', name: 'sf dharshan (1).pdf', checked: false },
    { id: '20935', name: 'case_document_2025060023.pdf', checked: false },
  ]);

  // Selected document
  readonly selectedDocId = signal<string>('20932');
  readonly selectedDoc = computed(() =>
    this.documents().find(doc => doc.id === this.selectedDocId())
  );

  // Search criteria form state
  readonly searchCriteria = signal<SearchCriteria>({
    caseNo: '',
    streetNo: '',
    direction: '',
    streetName: '',
    type: '',
    unitNo: '',
    apn: ''
  });

  // Raw mock database — kept as `any` for now
  private readonly caseSearchDatabase: any[] = mockCaseData;

  // Search results state — raw JSON shape, typed as `any[]` for now
  readonly searchResults = signal<any[]>([]);
  readonly isSearched = signal<boolean>(false);
  readonly selectedCase = signal<any | null>(null);

  // Dropdown & metadata
  readonly directions = signal<string[]>(['N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW']);
  readonly types = signal<string[]>(['Trash/Carts', 'Graffiti', 'Overgrowth', 'Signage', 'Zoning']);
  readonly templates = signal<string[]>([
    'Notice of Violation Letter',
    'Follow-up Citation Letter',
    'Case Closure Confirmation',
    'Standard Courtesy Warning'
  ]);

  readonly caseTags = signal<string[]>(['DFX Tag', 'LF Tag', 'Urgent Review', 'Tenant Issue']);
  readonly selectedTags = signal<string[]>(['DFX Tag']);
  readonly selectedTemplate = signal<string>('');

  constructor() {
    // Initial perform search to mimic screenshot having a loaded result
    // this.performSearch();
  }

  updateCriteria(key: keyof SearchCriteria, value: string) {
    this.searchCriteria.update(prev => ({
      ...prev,
      [key]: value
    }));
  }

  performSearch() {
    const criteria = this.searchCriteria();

    const results = this.caseSearchDatabase.filter((c: any) => {
      if (criteria.caseNo && !c.caseNumber?.includes(criteria.caseNo)) {
        return false;
      }
      if (criteria.streetNo && !c.caseaddress?.streetNumber?.includes(criteria.streetNo)) {
        return false;
      }
      if (
        criteria.streetName &&
        !c.caseaddress?.streetName?.toLowerCase().includes(criteria.streetName.toLowerCase())
      ) {
        return false;
      }
      if (criteria.apn && !c.caseaddress?.apn?.includes(criteria.apn)) {
        return false;
      }
      if (criteria.unitNo && !c.caseaddress?.unitNumber?.trim().includes(criteria.unitNo)) {
        return false;
      }
      if (
        criteria.direction &&
        c.caseaddress?.streetDirection?.trim().toUpperCase() !== criteria.direction.toUpperCase()
      ) {
        return false;
      }
      return true;
    });

    this.searchResults.set(results);
    this.isSearched.set(true);

    // Auto-select first result if available
    // this.selectedCase.set(results.length > 0 ? results[0] : null);
  }

  resetSearch() {
    this.searchCriteria.set({
      caseNo: '',
      streetNo: '',
      direction: '',
      streetName: '',
      type: '',
      unitNo: '',
      apn: ''
    });
    this.searchResults.set([]);
    this.isSearched.set(false);
    this.selectedCase.set(null);
  }

  selectDocument(docId: string) {
    this.documents.update(docs =>
      docs.map(doc => ({
        ...doc,
        checked: doc.id === docId
      }))
    );
    this.selectedDocId.set(docId);
  }

  toggleTag(tag: string) {
    this.selectedTags.update(tags =>
      tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]
    );
  }

  addNewTag(tag: string) {
    const cleanTag = tag.trim();
    if (cleanTag && !this.caseTags().includes(cleanTag)) {
      this.caseTags.update(tags => [...tags, cleanTag]);
      this.selectedTags.update(tags => [...tags, cleanTag]);
    }
  }

  setTemplate(template: string) {
    this.selectedTemplate.set(template);
  }
}