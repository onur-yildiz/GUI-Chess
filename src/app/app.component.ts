import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild ('timeInput') timeInput;

  currentPlayer = 'White';
  atHand = '';
  pickUpLocation: string;
  putDownLocation: string;
  originalPlace: HTMLElement;
  time = 0; // seconds
  playButton = '▶';

  constructor() {}

  ngOnInit() {}

  onClick(e: MouseEvent) {
    let targetElement = ( < HTMLElement > e.target);
    if (targetElement.innerText !== '' && this.atHand === '') {
      this.atHand = targetElement.innerText;
      this.pickUpLocation = targetElement.attributes["id"].value;
      targetElement.style.color = "orangered";
      targetElement.style.fontSize = "2em";
      this.originalPlace = targetElement;
    } else if (this.atHand !== '') {
      this.putDownLocation = targetElement.attributes["id"].value;
      let newLog = document.createElement('p');
      if (this.currentPlayer === 'Black') {
        newLog.style.backgroundColor = 'black';
        newLog.style.color = 'white';
      }
      newLog.innerText = `(${this.time}s) ${this.currentPlayer} : ${this.pickUpLocation} >> ${this.putDownLocation}`;
      if (targetElement.attributes['id'].value !== this.pickUpLocation) {
        this.originalPlace.innerText = '';
        if (targetElement.innerText !== '') {
          var newDead = document.createElement('span');
          let deadText = ` (${this.atHand} ☠ ${targetElement.innerText})`;
          newLog.innerText += deadText;
          newDead.innerText = targetElement.innerText;
          newDead.className = "dead";
          newDead.onclick = (element) => {
            if (this.atHand !== '' || this.pickUpLocation === '☠') {
              this.originalPlace.style.color = '';
              this.originalPlace.style.fontSize = '';
              if (this.pickUpLocation === '☠' && this.originalPlace === ( < HTMLElement > element.target)) {
                this.pickUpLocation = '';
                this.atHand = '';
                return;
              }
            }
            this.atHand = ( < HTMLElement > element.target).innerText;
            this.pickUpLocation = '☠';
            ( < HTMLElement > element.target).style.color = "orangered";
            this.originalPlace = ( < HTMLElement > element.target);
          }
          document.getElementById('deadpool').appendChild(newDead);
        }
      }
      if (this.pickUpLocation !== this.putDownLocation) {
        document.getElementById('loglist').prepend(newLog);
      }
      targetElement.innerText = this.atHand;
      this.atHand = '';
      this.originalPlace.style.color = '';
      this.originalPlace.style.fontSize = '';
      this.pickUpLocation = '';
      this.putDownLocation = '';
    }
  }

  onSwitchPlayers() {
    if (this.currentPlayer === 'White')
      this.currentPlayer = 'Black';
      else
      this.currentPlayer = "White";
  }

  onSetTimer() {
    let value = parseInt(this.timeInput.nativeElement.value)  ;
    if (!isNaN(value))
      this.time = value;
  }

  intervalId: any;
  timeFlow = false;
  onStartTimer() {
    if (!this.timeFlow) {
      if (this.time === 0) return;
      this.playButton = '❚❚'; 
      this.timeFlow = !this.timeFlow;
      this.intervalId = setInterval( () => {
        if (this.time === 0) {
          clearInterval(this.intervalId);
          alert('Time is up!');
          return;
        }
        this.time--;
      }, 1000);
    } else {
      this.playButton = '▶'; 
      clearInterval(this.intervalId);
      this.timeFlow = !this.timeFlow;
    }
  }
}
