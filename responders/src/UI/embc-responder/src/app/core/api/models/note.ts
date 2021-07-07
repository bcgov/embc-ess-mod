/* tslint:disable */
/* eslint-disable */
import { NoteType } from './note-type';
export interface Note {
  addedOn?: string;
  content?: null | string;
  creatingTeamMemberId?: null | string;
  id?: null | string;
  isHidden?: boolean;
  memberName?: null | string;
  teamName?: null | string;
  type?: NoteType;
}
