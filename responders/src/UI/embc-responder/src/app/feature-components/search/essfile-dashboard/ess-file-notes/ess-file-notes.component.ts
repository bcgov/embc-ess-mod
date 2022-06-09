import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Note } from 'src/app/core/api/models';
import {
  ActionPermission,
  ClaimType
} from 'src/app/core/services/authorization.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-ess-file-notes',
  templateUrl: './ess-file-notes.component.html',
  styleUrls: ['./ess-file-notes.component.scss']
})
export class EssFileNotesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  notesList: Array<Note>;
  notes = new MatTableDataSource<Note>();
  notes$: Observable<Array<Note>>;

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef,
    private userService: UserService
  ) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras.state as {
          notes: Array<Note>;
        };
        this.notesList = state.notes;
      }
    }
  }

  ngOnInit(): void {
    this.notes = new MatTableDataSource(this.notesList);
    this.notes.paginator = this.paginator;
    this.notes$ = this.notes.connect();
  }

  ngAfterViewInit(): void {
    this.notes.paginator = this.paginator;
    this.cd.detectChanges();
  }

  /**
   * Checks if the user can permission to perform given action
   *
   * @param action user action
   * @returns true/false
   */
  public hasPermission(action: string): boolean {
    return this.userService.hasClaim(
      ClaimType.action,
      ActionPermission[action]
    );
  }
}
