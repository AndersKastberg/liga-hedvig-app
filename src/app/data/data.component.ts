import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { DataService } from './data.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToastrModule, ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
  standalone: true,
  imports: [MatTableModule, CommonModule, RouterModule, MatCheckboxModule]
})
export class DataComponent implements OnInit {
  displayedColumns: string[] = ['select', 'name', 'price'];
  selectedDisplayedColumns: string[] = ['name', 'price'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  selectedDataSource: MatTableDataSource<any> = new MatTableDataSource();
  selection = new SelectionModel<any>(true, []);
  totalSelectedPrice = 0;
  selectionCount = 0;
  userId = 0; 
  teams: any[] = []; // Store user's teams
  selectedTeam: any; // Store selected team
  constructor(private dataService: DataService,
     private cdr: ChangeDetectorRef,
     ) { }

  ngOnInit() {
      // Simulate fetching user ID from a service or auth context
      this.getUserId().then(userId => {
        this.userId = userId;
        this.dataService.getData().subscribe(data => {
          this.dataSource.data = data;
        });
        this.viewTeams(); // Fetch teams when the component loads
      });
    console.debug('Teams', this.teams);
  }

  getUserId(): Promise<number> {
    // Simulate an asynchronous operation to fetch user ID
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(1); // Replace with actual logic to fetch user ID
      }, 100);
    });
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isAnySelected() {
    const numSelected = this.selection.selected.length;
    return numSelected > 0 && numSelected < this.dataSource.data.length;
  }

  selectAllRows() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
    this.updateSelectedDataSource();
  }

  toggleRowSelection(row: any) {
    if (!this.selection.isSelected(row) && this.selection.selected.length >= 24) {
      // this.toastr.error(
      //   "Du kan kun vælge 24 ryttere."
      // );

       alert("Du kan kun vælge 24 ryttere.");
      return; // Exit if limit is reached
    }
    const rowPrice = Number(row.Price);
    const newTotalPrice = this.totalSelectedPrice + (this.selection.isSelected(row) ? -rowPrice : rowPrice);

    // Check if the new total price exceeds 50,000,000 DKK
    if (!this.selection.isSelected(row) && newTotalPrice > 50000000) {
      // this.toastr.error("Du kan ikke vælge denne rytter da prisen da vil overstige 50000000 DKK.");
      alert("Du kan ikke vælge denne rytter da prisen da vil overstige 50000000 DKK.");
      return; // Exit if limit is reached
    }
    this.selection.toggle(row);
    this.updateSelectedDataSource();
  }

  updateSelectedDataSource() {
    
    this.selectedDataSource.data = this.selection.selected;
    this.selectionCount = this.selection.selected.length; // Update selection count
    this.calculateTotalPrice();
    this.cdr.detectChanges();
  }
  calculateTotalPrice() {
    this.totalSelectedPrice = this.selection.selected.reduce((total, record) => {
      const price = Number(record.Price); // Ensure price is a number
      return total + (isNaN(price) ? 0 : price);
    }, 0);
  }

  addTeam() {
    const teamName = prompt("Enter team name:");
    const year =2025;
    if (teamName && year) {
      this.saveTeam(teamName);
    }
  }
  
  saveTeam(teamName: string) {
       
    if (teamName) {
      this.dataService.saveTeam(this.userId, teamName, 2025, this.selection.selected).subscribe(response => {
        alert("Team saved successfully!");
      }, error => {
        alert("Error saving team: " + error.message);
      });
    }
  }

  viewTeams() {
    this.dataService.getTeams(this.userId).subscribe(teams => {
      this.teams = teams;
    }, error => {
      alert("Error fetching teams: " + error.message);
    });
  }

  onTeamChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const teamId = selectElement.value;
    this.selectedTeam = this.teams.find(team => team.id === parseInt(teamId, 10));
  }
  editTeam(team: any) {
    const newTeamName = prompt("Enter new team name:", team.name);
    const newYear = prompt("Enter new year:", team.year);
    if (newTeamName && newYear) {
      this.dataService.editTeam(team.id, newTeamName, Number(newYear), team.riders).subscribe(response => {
        alert("Team edited successfully!");
      }, error => {
        alert("Error editing team: " + error.message);
      });
    }
  }

}
