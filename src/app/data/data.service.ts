import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000/data';
  private teamUrl = 'http://localhost:3000/api/team';
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
