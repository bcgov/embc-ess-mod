import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-component-loader',
  templateUrl: './component-loader.component.html',
  styleUrls: ['./component-loader.component.scss']
})
export class ComponentLoaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
