import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, map} from 'rxjs';
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

  public loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      map((value) => this.getDistinctOlympics(value)),
      tap((distinctOlympics) => this.olympics$.next(distinctOlympics)),

      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        // @ts-ignore
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  public getOlympics() {
    return this.olympics$.asObservable();
  }

  private getDistinctOlympics(olympic: Olympic[]): Olympic[] {
    const countries = new Set<string>();

    return olympic.filter((olympic) => {
      /* check if the country is already in the set and add it if not */
      return !countries.has(olympic.country) && countries.add(olympic.country);
    });
  }
}
