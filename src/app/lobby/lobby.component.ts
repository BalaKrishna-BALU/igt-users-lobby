import { CommonModule } from '@angular/common';
import { UsersService } from './../services/users.service';
import { Component, inject, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

export type UsersResponse = {
  code: string;
  data: User[];
  meta: any;
};

export type User = {
  id: number;
  email: string;
  gender: string;
  name: string;
  status: string;
};

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatInputModule,
    MatFormFieldModule,
    MatIcon,
    MatSelectModule,
    MatProgressBarModule,
  ],
  templateUrl: './lobby.component.html',
  styleUrl: './lobby.component.css',
})
export class LobbyComponent implements OnInit {
  users: User[] = [];
  usersCopy: User[] = [];
  pageNumber: number = 1;
  totalPages!: number;
  searchText!: string;
  selectedSorting!: string;
  selectedStatus!: string;
  selectedGender!: string;
  isFilterApplied: boolean = false;
  isFetchingData: boolean = false;
  snackBar = inject(MatSnackBar);

  constructor(private usersService: UsersService, private router: Router) {}

  ngOnInit(): void {
    this.isFetchingData = true;
    this.getUsers();
  }

  getUsers(): void {
    this.usersService.getUsers().subscribe({
      next: (response: UsersResponse) => {
        this.users = response.data;
        this.usersCopy = response.data;
        this.totalPages = response.meta.pagination.pages;
        this.isFetchingData = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('error', error);
        this.isFetchingData = false;
        this.snackBar.open('Error occurred while fetching users', '', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 2500,
        });
      },
    });
  }

  loadMoreUsers(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
    } else {
      return;
    }
    this.isFetchingData = false;
    this.usersService.getNextUsers(this.pageNumber).subscribe({
      next: (response: UsersResponse) => {
        this.users = this.users.concat(response.data);
        this.usersCopy = this.usersCopy.concat(response.data);
        this.isFetchingData = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('error', error);
        this.isFetchingData = false;
        this.snackBar.open('Error occurred while fetching next users', '', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 2500,
        });
      },
    });
  }

  searchUsers(): void {
    this.users = this.users.filter((user) => {
      return user.name.toLowerCase().includes(this.searchText.toLowerCase());
    });
  }

  sortUsers(): void {
    if (this.selectedSorting === 'asc') {
      this.users.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      this.users.sort((a, b) => b.name.localeCompare(a.name));
    }
  }

  statusChanged(): void {
    this.users = this.users.filter(
      (user) => user.status === this.selectedStatus
    );
  }

  genderChanged(): void {
    this.users = this.users.filter(
      (user) => user.gender === this.selectedGender
    );
  }

  applyFilters(): void {
    this.isFilterApplied = true;
    if (this.searchText) {
      this.searchUsers();
    }
    if (this.selectedSorting) {
      this.sortUsers();
    }
    if (this.selectedStatus) {
      this.statusChanged();
    }
    if (this.selectedGender) {
      this.genderChanged();
    }
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedSorting = '';
    this.selectedStatus = '';
    this.selectedGender = '';
    this.users = [...this.usersCopy];
    this.isFilterApplied = false;
  }

  viewUserDetails(userId: number): void {
    this.router.navigate(['/details/', userId]);
  }
}
