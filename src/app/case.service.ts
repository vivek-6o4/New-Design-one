import { Injectable, signal, computed } from '@angular/core';

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

export interface CaseResult {
  caseNo: string;
  address: string;
  program: string;
  status: 'Open' | 'Closed' | 'Pending';
  openDate: string;
  closeDate: string;
  inspector: string;
  secondInspector: string;
  notions: string;
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
    streetNo: '1441', // initialized with 1441 as in screenshot
    direction: '',
    streetName: '',
    type: '',
    unitNo: '',
    apn: ''
  });

  // Database of mock cases
  private readonly caseDatabase: CaseResult[] = [
    {
      caseNo: '2025060023',
      address: '1441 MICHIGAN AV',
      program: 'Abandoned Shopping Carts',
      status: 'Open',
      openDate: '',
      closeDate: '',
      inspector: '',
      secondInspector: '',
      notions: 'Notions'
    },
    {
      caseNo: '2025060024',
      address: '1441 MICHIGAN AV',
      program: 'Graffiti Abatement',
      status: 'Closed',
      openDate: '2026-05-12',
      closeDate: '2026-05-20',
      inspector: 'M. Harris',
      secondInspector: 'J. Inspector',
      notions: 'Graffiti cleaned from brick wall face.'
    },
    {
      caseNo: '2025060085',
      address: '1200 BROADWAY ST',
      program: 'Overgrown Vegetation',
      status: 'Open',
      openDate: '2026-07-01',
      closeDate: '',
      inspector: 'K. Davis',
      secondInspector: '',
      notions: 'Overgrown lawn blockading adjacent pedestrian sidewalk.'
    }
  ];

  // Search results state
  readonly searchResults = signal<CaseResult[]>([]);
  readonly isSearched = signal<boolean>(false);
  readonly selectedCase = signal<CaseResult | null>(null);

  // Tags & templates metadata
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
    // Initial perform search to mimic screenshot having loaded result for '1441'
    this.performSearch();
  }

  // Update search criteria field
  updateCriteria(key: keyof SearchCriteria, value: string) {
    this.searchCriteria.update(prev => ({
      ...prev,
      [key]: value
    }));
  }

  // Perform search based on criteria
  performSearch() {
    const criteria = this.searchCriteria();
    
    // Simple filter logic
    const results = this.caseDatabase.filter(c => {
      if (criteria.caseNo && !c.caseNo.includes(criteria.caseNo)) return false;
      if (criteria.streetNo && !c.address.toLowerCase().includes(criteria.streetNo.toLowerCase())) return false;
      if (criteria.streetName && !c.address.toLowerCase().includes(criteria.streetName.toLowerCase())) return false;
      return true;
    });

    this.searchResults.set(results);
    this.isSearched.set(true);

    // Auto-select first result if available
    if (results.length > 0) {
      this.selectedCase.set(results[0]);
    } else {
      this.selectedCase.set(null);
    }
  }

  // Reset criteria and results
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

  // Select a document
  selectDocument(docId: string) {
    this.documents.update(docs => 
      docs.map(doc => ({
        ...doc,
        checked: doc.id === docId
      }))
    );
    this.selectedDocId.set(docId);
  }

  // Toggle tag selection
  toggleTag(tag: string) {
    this.selectedTags.update(tags => {
      if (tags.includes(tag)) {
        return tags.filter(t => t !== tag);
      } else {
        return [...tags, tag];
      }
    });
  }

  // Add a new custom tag
  addNewTag(tag: string) {
    const cleanTag = tag.trim();
    if (cleanTag && !this.caseTags().includes(cleanTag)) {
      this.caseTags.update(tags => [...tags, cleanTag]);
      this.selectedTags.update(tags => [...tags, cleanTag]);
    }
  }

  // Set selected template
  setTemplate(template: string) {
    this.selectedTemplate.set(template);
  }
}
