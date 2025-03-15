import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { PagedData } from '../types/paged-data';
import { ILeave } from '../types/leave';
import { IAttendace } from '../types/attendace';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  http = inject(HttpClient);
  constructor() {}

  applyLeave(type: number, reason: string, date: string) {
    return this.http.post(environment.apiUrl + '/api/Leave/apply', {
      type,
      reason,
      leaveDate: date,
    });
  }
  getLeaves(filter: any) {
    var params = new HttpParams({ fromObject: filter });
    return this.http.get<PagedData<ILeave>>(
      environment.apiUrl + '/api/Leave?' + params.toString()
    );
  }
  updateLeaveStatus(id: number, status: number) {
    return this.http.post(environment.apiUrl + '/api/Leave/update-status', {
      id,
      status,
    });
  }

  markPresent() {
    return this.http.post(
      environment.apiUrl + '/api/Attendance/mark-present',
      {}
    );
  }

  getAttendaceHistory(filter: any) {
    var params = new HttpParams({ fromObject: filter });
    return this.http.get<PagedData<IAttendace>>(
      environment.apiUrl + '/api/Attendance?' + params.toString()
    );
  }
}
