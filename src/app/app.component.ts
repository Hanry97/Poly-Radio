import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay } from 'rxjs/operators';
import { Radio } from './radio';
import { RadioListService } from './radio-list.service';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  radios: Radio[] = [];
  radio: any;
  nom:any;

  constructor(private observer: BreakpointObserver, public rs: RadioListService) {}

  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });
      
  }

  ngOnInit(): void {
    this.rs.getListRadios().subscribe((response) => {
      this.radios = response;
      this.radio = this.radios[0];
    });
    
  }

  searchRadio(value:any) {
    if (this.nom == "") {
      this.ngOnInit();
    } else {
      this.radios = this.radios.filter(res => {
        return res.name.toLowerCase().match(value.toLowerCase());
      })
    }
  }

  changeRadio(num:any){
    let founded = "rien";
    for(let rd of this.radios){
      if(rd.num == num){
        this.radio = rd;
      }
   }
  }
}