import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable, tap} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Olympic} from "../models/Olympic";

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {
  }

  public loadInitialData(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      map((olympic) => this.getDistinctOlympics(olympic)),
      tap(olympics => this.olympics$.next(this.getDistinctOlympics(olympics))),

      catchError((error, caught) => {
        console.error('Error loading initial data:', error);
        this.olympics$.next([]);

        return caught;
      })
    );
  }

  public getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }

  public getOlympicByCountry(country: string): Observable<Olympic> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      /* The result is either Olympic founded or an error is thrown */
      map(olympics => olympics.find(olympic => olympic.country === country) || (() => {
          console.error('Country not found:', country);
          throw new Error('Country not found');
        })()
      )
    );
  }

  private getDistinctOlympics(olympic: Olympic[]): Olympic[] {
    return olympic.filter((olympic: Olympic, index: number, array: Olympic[]) =>
      array.findIndex((t: Olympic) => t.country === olympic.country) === index
    );
  }
}
