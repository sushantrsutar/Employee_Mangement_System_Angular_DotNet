import { Routes } from '@angular/router';
import { AttendaceComponent } from './pages/attendace/attendace.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { EmployeedashboardComponent } from './pages/employeedashboard/employeedashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { LeavesComponent } from './pages/leaves/leaves.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'employee-dashboard',
    component: EmployeedashboardComponent,
  },
  {
    path: 'departments',
    component: DepartmentsComponent,
  },
  {
    path: 'employee',
    component: EmployeeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'leaves',
    component: LeavesComponent,
  },
  {
    path: 'attendace',
    component: AttendaceComponent,
  },
  {
    path: 'attendace/:id',
    component: AttendaceComponent,
  },
];
