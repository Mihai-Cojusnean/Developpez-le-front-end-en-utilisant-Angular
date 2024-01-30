import {Component, OnDestroy, OnInit} from '@angular/core';
import {OlympicService} from "../../core/services/olympic.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Olympic} from "../../core/models/Olympic";
import {Participation} from "../../core/models/Participation";
import {finalize, Subject, takeUntil} from "rxjs";
import {LoaderService} from "../../core/services/loader.service";

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.scss']
})
export class CountryDetailsComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public olympic!: Olympic;

  public chartData: { name: string, series: { name: string, value: number }[] }[] = []
  public nrOfMedalsInTotal: number = 0;
  public nrOfEntries: number = 0;
  public nrOfAthletes: number = 0;
  public country: string = "";

  constructor(private route: ActivatedRoute,
              private router: Router,
              private olympicService: OlympicService,
              protected loaderService: LoaderService) {
  }

  ngOnInit(): void {
    const showLoading: NodeJS.Timeout = setTimeout(() => {
      this.loaderService.showLoader();
    }, 400);

    this.country = this.route.snapshot.params['name'];
    this.olympicService.getOlympicByCountry(this.country)
      .pipe(takeUntil(this.destroy$),
        finalize(() => {
          clearTimeout(showLoading);
          this.loaderService.hideLoader()
        }))
      .subscribe((olympic: Olympic) => {
        this.olympic = olympic;
        this.setUpChart();
        this.initializeStatistics();
      }, error => this.router.navigate(['/not-found']));
  }

  private setUpChart(): void {
    this.chartData = [{
      name: '',
      series: this.olympic.participations.map(participation => ({
        name: participation.year.toString(),
        value: participation.medalsCount,
      })),
    }];
  }

  private initializeStatistics(): void {
    this.nrOfMedalsInTotal = this.getTotalMedalsCount(this.olympic.participations);
    this.nrOfEntries = this.olympic.participations.length;
    this.nrOfAthletes = this.getTotalAthletesCount(this.olympic.participations);
  }

  private getTotalMedalsCount(participations: Participation[]): number {
    return participations.reduce((total: number, p: Participation) => total + p.medalsCount, 0);
  }

  private getTotalAthletesCount(participations: Participation[]): number {
    return participations.reduce((total: number, p: Participation) => total + p.athleteCount, 0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
