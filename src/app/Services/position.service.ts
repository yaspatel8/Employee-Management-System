import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Position } from '../models/position';

@Injectable({
  providedIn: 'root',
})
export class PositionService {
  constructor(private http: HttpClient) { }

  apiUrl = "https://localhost:7177/GetAllPosition";

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
    return this.http.post("https://localhost:7177/SavePosition", position);
  }
  getAllActivePositions() {
    return this.http.get("https://localhost:7177/GetPositionActive");
  }

  updatePositionStatus(positionId: number, isActive: boolean, updatedBy: number) {
    return this.http.post(`https://localhost:7177/UpdatePositionStatus?positionId=${positionId}&isActive=${isActive}&updatedBy=${updatedBy}`, {});
    
  }

  deletePosition(id: number) {
    return this.http.delete(`https://localhost:7177/DeletePosition/${id}`);
  }

}
