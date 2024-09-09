import { ActivatedRoute } from '@angular/router';
import { UsersService } from './../services/users.service';
import { Component, inject, OnInit } from '@angular/core';

import { MatCardModule } from '@angular/material/card';

import { User, UsersResponse } from './../lobby/lobby.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

export type UserResponse = Omit<UsersResponse, 'data'> & {
  data: User;
};

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  user: User | undefined;
  snackBar = inject(MatSnackBar);

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      let userId = param.get('userId');
      userId &&
        this.usersService.getUser(userId).subscribe({
          next: (response: UserResponse) => {
            this.user = response.data;
          },
          error: (error: HttpErrorResponse) => {
            console.error('error', error);
            this.snackBar.open(
              'Error occurred while fetching user details',
              '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 2500,
              }
            );
          },
        });
    });
  }
}
