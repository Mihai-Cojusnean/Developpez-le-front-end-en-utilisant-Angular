import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, filter, map, Observable} from 'rxjs';
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

  public getOlympicByName(name: string): Observable<Olympic> {
    return this.getOlympics().pipe(
      map((olympics) => olympics.find((olympic) => olympic.country === name)),
      filter((olympic): olympic is Olympic => !!olympic),

      catchError((error) => {
        console.error('Error finding Olympic:', error);
        throw error;
      })
    );
  }

  private getDistinctOlympics(olympic: Olympic[]): Olympic[] {
    const countries = new Set<string>();

    return olympic.filter((olympic) => {
      /* check if the country is already in the set and add it if not */
      return !countries.has(olympic.country) && countries.add(olympic.country);
    });
  }
}
