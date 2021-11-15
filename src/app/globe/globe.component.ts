import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.scss']
})
export class GlobeComponent implements OnInit, AfterViewInit {

  constructor() { }
  
  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {
  }

}
