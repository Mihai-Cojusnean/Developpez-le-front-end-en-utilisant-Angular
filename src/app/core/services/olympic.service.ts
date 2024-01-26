import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
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
      map((value) => this.getDistinctOlympics(value)),
      tap((distinctOlympics) => this.olympics$.next(distinctOlympics)),

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
    const countries = new Set<string>();

    return olympic.filter((olympic) => {
      /* Check if the country is already in the set and add it if not */
      return !countries.has(olympic.country) && countries.add(olympic.country);
    });
  }
}
