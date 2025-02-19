import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataService } from './data.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { decodeToken } from '../../utils/jwt.utils';


@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
  standalone: true,
  imports: [MatTableModule, CommonModule, RouterModule, MatCheckboxModule, MatFormFieldModule, MatInputModule]
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
    private cdr: ChangeDetectorRef,private toastr: ToastrService
  ) { }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeToken(token);
      this.userId = decodedToken.id; // Adjust this based on your token structure
      console.debug('this.userId', this.userId);

      this.dataService.getData().subscribe(data => {
        this.dataSource.data = data;
      });
      this.viewTeams(); // Fetch teams when the component loads
    } else {
      console.error('User is not logged in');
    }
  }

  isAnySelected() {
    const numSelected = this.selection.selected.length;
    return numSelected > 0 && numSelected < this.dataSource.data.length;
  }

  toggleRowSelection(row: any) {
    if (!this.selection.isSelected(row) && this.selection.selected.length >= 24) {

      this.toastr.error("Du kan kun vælge 24 ryttere.");
      return; // Exit if limit is reached
    }
    const rowPrice = Number(row.Price);
    const newTotalPrice = this.totalSelectedPrice + (this.selection.isSelected(row) ? -rowPrice : rowPrice);

    // Check if the new total price exceeds 50,000,000 DKK
    if (!this.selection.isSelected(row) && newTotalPrice > 50000000) {
      this.toastr.error("Du kan ikke vælge denne rytter da prisen da vil overstige 50000000 DKK.");
      return; // Exit if limit is reached
    }
    this.selection.toggle(row);
    this.updateSelectedDataSource();
  }

  updateSelectedDataSource() {

    this.selectedDataSource.data = this.selection.selected;
    this.selectionCount = this.selection.selected.length; // Update selection count
    // console.debug('updateSelectedDataSource()', this.selection.selected);
    this.sortSelectedData(); // Sort selected data by price descending
    this.calculateTotalPrice();
    this.cdr.detectChanges();
  }
  calculateTotalPrice() {
    this.totalSelectedPrice = this.selection.selected.reduce((total, record) => {
      const price = Number(record.Price); // Ensure price is a number
      return total + (isNaN(price) ? 0 : price);
    }, 0);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addTeam() {
    if (this.teams.length >= 5) {
      this.toastr.error("Du kan kun oprette 5 teams.");
      return;
    }
    const teamName = prompt("Enter team name:");
    const year = 2025;
    if (teamName && year) {
      this.saveTeam(teamName, year);
    }
  }

  saveTeam(teamName: string, year: number) {

    // if (this.teams.length >= 5) {
    //   this.toastr.error("Du kan kun oprette 5 teams.");
    //   return;
    // }
    if (teamName) {
      const currentSelectedTeamId = this.selectedTeam ? this.selectedTeam.id : null;

      if (teamName) {
        this.dataService.saveTeam(this.userId, teamName, year, this.selection.selected).subscribe(response => {
          this.toastr.success("Team saved successfully!");
          this.viewTeams(currentSelectedTeamId); // Fetch teams after saving a new team
        }, error => {
          this.toastr.error("Error saving team: " + error.message);
        });
      }
    }
  }
  viewTeams(currentSelectedTeamId?: number) {
    this.dataService.getTeams(this.userId).subscribe(teams => {
      this.teams = teams;
      if (this.teams.length > 0) {

        if (currentSelectedTeamId) {
          this.selectTeam(currentSelectedTeamId); // Keep the current team selected
        } else {
          this.selectTeam(this.teams[0].id); // Select the first team if no current selection
        }
      }
    }, error => {
      this.toastr.error("Error fetching teams: " + error.message);
    });
  }

  

  selectTeam(teamId: number) {
    this.dataService.getTeamById(teamId).subscribe(team => {
      console.debug('selectTeam()', team);
    });

    this.selectedTeam = this.teams.find(team => team.id === teamId);
    console.debug('selectTeam - this.selectedTeam', this.selectedTeam);
    this.selectedDataSource.data = this.selectedTeam?.riders || [];
    this.updateSelection(); // Update selection to check selected riders in the left panel
    this.sortSelectedData();
    this.calculateTotalPrice(); // Recalculate total price based on selected team
  }

  updateSelection() {
    this.selection.clear(); // Clear current selection
    const selectedRiderIds = new Set(this.selectedTeam?.riders.map((rider: any) => rider.id));
    // console.debug('updateSelection() selectedRiderIds', selectedRiderIds,this.selectedTeam);
    this.dataSource.data.forEach(row => {
      if (selectedRiderIds.has(row.ID)) {
        this.selection.select(row);
      }
    });
    this.updateSelectedDataSource(); // Update the selected data source
  }

  sortSelectedData() {
    this.selectedDataSource.data = this.selectedDataSource.data.sort((a, b) => b.Price - a.Price);
  }

  onTeamChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const teamId = selectElement.value;
    this.selectTeam(parseInt(teamId, 10));
  }


  editTeam(team: any) {
    const newTeamName = prompt("Enter new team name:", team.name);
    const newYear = 2025;
    if (newTeamName && newYear) {
      this.dataService.editTeam(team.id, newTeamName, Number(newYear), team.riders).subscribe(response => {
        this.toastr.success("Team edited successfully!");
      }, error => {
        this.toastr.error("Error editing team: " + error.message);
      });
    }
  }

}
