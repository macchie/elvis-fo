import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PagedResult<T> {
  data: T[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class APIService {
  private readonly baseUrl = '/api/items';

  constructor(private http: HttpClient) {}

  fetchItems<T>(
    offset: number,
    limit: number,
    sortField?: string,
    sortOrder?: 'asc' | 'desc',
    filterField?: string,
    filterValue?: any
  ): Observable<PagedResult<T>> {
    let params = new HttpParams()
      .set('offset', offset.toString())
      .set('limit', limit.toString());

    if (sortField) {
      params = params.set('sortField', sortField);
    }
    if (sortOrder) {
      params = params.set('sortOrder', sortOrder);
    }
    if (filterField && filterValue != null) {
      params = params.set('filterField', filterField);
      params = params.set('filterValue', filterValue.toString());
    }

    return this.http.get<PagedResult<T>>(this.baseUrl, { params });
  }
}
