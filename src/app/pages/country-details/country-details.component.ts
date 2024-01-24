import {Component, OnInit} from '@angular/core';
import {OlympicService} from "../../core/services/olympic.service";
import {ActivatedRoute} from "@angular/router";
import {Olympic} from "../../core/models/Olympic";
import {Participation} from "../../core/models/Participation";

@Component({
  selector: 'app-country-details',
  templateUrl: './country-details.component.html',
  styleUrls: ['./country-details.component.scss']
})
export class CountryDetailsComponent implements OnInit {
  public olympic!: Olympic;

  public chartData: { name: string, series: { name: string, value: number }[] }[] = []

  public nrOfMedalsInTotal: number = 0;
  public nrOfEntries: number = 0;
  public nrOfAthletes: number = 0;
  public countryName: string = "";

  constructor(private route: ActivatedRoute,
              private olympicService: OlympicService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.countryName = params['name'];
      this.olympicService.getOlympicByName(this.countryName).subscribe((olympic) => {
        this.olympic = olympic;
        this.setUpChart();
        this.initializeStatistics();
      });
    });
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
}
