import { Component, Input, OnInit, AfterViewInit, ElementRef, Output, EventEmitter } from '@angular/core';
import * as $ from "jquery";
declare var setRadio: any;

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, AfterViewInit {
  @Input() radio: any;
  @Input() radios: any;
  @Output() someEvent = new EventEmitter<string>();

  player = new Audio;
  audio: any;
  isPlaying = false;
  isMute = false;
  
  constructor(private elRef: ElementRef) { }

  ngOnInit(): void {
  }
  ngOnDestroy() {
  }

  ngAfterViewInit(){
    $.getScript('assets/js/scripts.js');
    this.setRadio(this.radio.url);
  }

setRadio(url:string){
	this.audio = new Audio(url);
}

radioPlay () {
		(document.querySelector('.play') as HTMLElement).style.display = 'none';
		(document.querySelector('.pause') as HTMLElement).style.display = 'inline-block';
    (document.querySelector('.avatar') as HTMLElement).classList.add('loading');
		this.audio.play();
		this.isPlaying = true;
}
radioPause(){
    (document.querySelector('.play') as HTMLElement).style.display = 'inline-block';
		(document.querySelector('.pause') as HTMLElement).style.display = 'none';
    (document.querySelector('.avatar') as HTMLElement).classList.remove('loading');
		this.audio.pause();
		this.isPlaying = false;
}

changeAndLauch(url:any){
  this.radioPause();
  this.setRadio(url);
  this.radioPlay();
}

nextSong(){
  let founded = false;
  let i: number = 0;
  let x: number = 0;

   while (i < this.radios.length && founded!=true) {
    if(this.radios[i].num == this.radio.num){
      x = i+1;
      if((x) == this.radios.length) x = 0;
      this.radio = this.radios[x];
      founded = true;
    }
    i++;
  }
  if(founded==true) {
    this.someEvent.next(this.radio.num);
    this.changeAndLauch(this.radio.url);
  }
}

prevSong(){
  let founded = false;
  let i: number = 0;
  let x: number = 0;

   while (i < this.radios.length && founded!=true) {
    if(this.radios[i].num == this.radio.num){
      x = i-1;
      if((x) < 0) x = this.radios.length-1;
      this.radio = this.radios[x];
      founded = true;
    }
    i++;
  }
  if(founded==true) {
    this.someEvent.next(this.radio.num);
    this.changeAndLauch(this.radio.url);
  }
}

muteAudio(){
  
  if (this.audio.volume !== 0) {
    this.audio.volume = 0;
    (document.querySelector('.soundControl') as HTMLElement).style.opacity = "0.4";
  } else {
    this.audio.volume = 1;
    (document.querySelector('.soundControl') as HTMLElement).style.opacity = "1";
  }
}

}
