import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Position } from '../models/position';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class PositionService {
  constructor(private http: HttpClient) { }

  apiUrl = `${environment.apiUrl}/GetAllPosition`;

  getPositions(
    searchText: string = '', pageNumber: number = 0, pageSize: number = 0, SortColumn: string = '', SortOrder: string = '') {
    return this.http.post<any>(
      this.apiUrl,
      {
        searchText,
        pageNumber,
        pageSize,
        SortColumn,
        SortOrder
      }
    );
  }
  savePosition(position: Position) {
    return this.http.post(`${environment.apiUrl}/SavePosition`, position);
  }
  getAllActivePositions() {
    return this.http.get(`${environment.apiUrl}/GetPositionActive`);
  }

  updatePositionStatus(positionId: number, isActive: boolean, updatedBy: number) {
    return this.http.post(`${environment.apiUrl}/UpdatePositionStatus?positionId=${positionId}&isActive=${isActive}&updatedBy=${updatedBy}`, {});
    
  }

  deletePosition(id: number) {
    return this.http.delete(`${environment.apiUrl}/DeletePosition/${id}`);
  }

}
