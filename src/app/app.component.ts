import {Component, OnDestroy, OnInit} from '@angular/core';
import {OlympicService} from "./core/services/olympic.service";
import {Subject, take, takeUntil} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private olympicService: OlympicService) {
  }

  ngOnInit(): void {
    this.olympicService.loadInitialData().pipe(takeUntil(this.destroy$), take(1)).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
