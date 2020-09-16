import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  componentToLoad: string;
  profileFolderPath = 'evacuee-profile-forms';

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.componentToLoad = params.get('type');
    });
  }

  // save() {

  // }

  cancel(): void {
    this.router.navigate(['/loader/needs-assessment']);
  }

}
