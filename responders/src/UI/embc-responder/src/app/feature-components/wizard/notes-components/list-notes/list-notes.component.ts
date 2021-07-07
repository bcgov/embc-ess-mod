import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Note } from 'src/app/core/api/models';

@Component({
  selector: 'app-list-notes',
  templateUrl: './list-notes.component.html',
  styleUrls: ['./list-notes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListNotesComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() notesList: Array<Note>;
  notes = new MatTableDataSource();
  notes$: Observable<Array<Note>>;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.notesList) {
      this.notes = new MatTableDataSource(this.notesList);
      this.notes.paginator = this.paginator;
      this.notes$ = this.notes.connect();
    }
  }

  ngAfterViewInit(): void {
    this.notes.paginator = this.paginator;
    this.cd.detectChanges();
  }
}
