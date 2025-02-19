import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = environment.apiUrl+'data';
  private teamUrl = environment.apiUrl+'api/team';
  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);   
  }

  saveTeam(userId: number, teamName: string, year: number, riders: any[]): Observable<any> {
    const riderIds = riders.map(rider => ({ id: rider.ID }));
    console.debug('Selected riders:', riders);
    return this.http.post(`${this.teamUrl}/save`, { userId, teamName, year, riders: riderIds });
  }
  getTeams(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.teamUrl}/${userId}`);
  }

  editTeam(teamId: string, teamName: string, year: number, riders: any[]): Observable<any> {
    const riderIds = riders.map(rider => ({ id: rider.ID }));
    return this.http.put(`${this.teamUrl}/${teamId}`, { teamName, year, riders: riderIds });
  }
  getTeamById(teamId: number): Observable<any> {
    return this.http.get<any>(`${this.teamUrl}/teams/${teamId}`);
  }
  
}
