import { Component } from "@angular/core";
import { MatSliderChange } from "@angular/material/slider";
import { BehaviorSubject } from "rxjs";
import { debounceTime } from "rxjs/operators";

interface Project {
  _id: number;
  name: string;
}

interface TimeScale {
  value: number;
  viewValue: string;
}

interface ProjectTime {
  _id: number | null;
  projectid: number;
  timescale: number;
  time: number;
  timeLeft: number;
  timeElapsed: number;
}

/**
 * @title Basic select
 */
@Component({
  selector: "project-timer",
  templateUrl: "project-timer.html"
})
export class ProjectTimer {
  //SelectOverviewExample {

  projects: Project[] = [
    { _id: 1, name: "Angular" },
    { _id: 2, name: "Ionic" },
    { _id: 3, name: "Flutter" }
  ];

  timescales: TimeScale[] = [
    { value: 1, viewValue: "sec" },
    { value: 60, viewValue: "min" },
    { value: 3600, viewValue: "hr" }
  ];

  projectTime: ProjectTime = {
    _id: null,
    projectid: 1,
    timescale: 1,
    time: 0,
    timeLeft: -1,
    timeElapsed: 0
  };

  timeLeft: number = 60;
  interval: any;

  sliderValueSubject = new BehaviorSubject<number|null>(0);
  
  onSlide(event: MatSliderChange) {
    /*this is firing in every tick of the slide, it's wiser to use debounce on listener...
    this.projectTime.time = (event.value ? event.value : 0);
    this.projectTime.timeLeft = (event.value ? event.value : 0) * this.projectTime.timescale;*/
    this.sliderValueSubject.next(event.value);
  }

  ngOnInit() {
    this.sliderValueSubject
      .pipe(debounceTime(400))
      .subscribe( value => {
          this.projectTime.time = (value ? value : 0);
          this.projectTime.timeElapsed = 0;
          this.setTimeLeft();
          console.log(`Time has changed to value : ${value}`); 
      });
  }


  startTimer() {
    this.interval = setInterval(() => {
      if (this.projectTime.timeLeft > 0) {
        this.projectTime.timeLeft--;
      }
      this.projectTime.timeElapsed++;
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  setTimeLeft() {
    this.projectTime.timeLeft = this.projectTime.time * this.projectTime.timescale;
  }

  /** Helper function to get the viewValue from drop down value of type TimeScale */
  getTimeScale(filterValue:number) {
    const result = this.timescales.filter( (item) => {
      return (item.value == filterValue); //condition to return item
    });
    
    return (result) ? result[0].viewValue : null;
  }


}

/**  Copyright 2020 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
