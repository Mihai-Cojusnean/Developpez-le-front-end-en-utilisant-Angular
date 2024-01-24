import {Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {OlympicService} from 'src/app/core/services/olympic.service';
import {Olympic} from "../../core/models/Olympic";
import {Participation} from "../../core/models/Participation";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympic[]> = of([]);

  public chartData: {name: string, value: number}[] = [];

  public nrOfCountries: number = 0;
  public nrOfJOs: number = 0;

  constructor(private router: Router,
              private olympicService: OlympicService) {
  }

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe((olympics: Olympic[]) => {
      this.setUpChart(olympics);
      this.initializeStatistics(olympics);
    });
  }

  private setUpChart(olympics: Olympic[]): void {
    this.chartData = olympics.map((olympic: Olympic) => ({
      name: olympic.country,
      value: this.getTotalMedalsCount(olympic.participations)
    }));
  }

  private getTotalMedalsCount(participations: Participation[]): number {
    return participations.reduce((total: number, p: Participation) => total + p.medalsCount, 0);
  }

  public onChartClick(event: {name: string, value: number}): void {
    this.router.navigate(['country', event.name])
  }

  private initializeStatistics(olympics: Olympic[]): void {
    this.nrOfJOs = olympics[0]?.participations.length;
    this.nrOfCountries = olympics.length;
  }
}
