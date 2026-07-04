import { Component, signal } from '@angular/core';
import { WorkspaceComponent } from './workspace/workspace';

@Component({
  selector: 'app-root',
  imports: [WorkspaceComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('design-app');
}
