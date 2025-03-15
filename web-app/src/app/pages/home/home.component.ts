import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DashboardService } from '../../services/dashboard.service';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { IDepartmentData } from '../../types/dahsboard';
import { TableComponent } from '../../components/table/table.component';
import { PagedData } from '../../types/paged-data';
import { ILeave, LeaveStatus, LeaveType } from '../../types/leave';
import { AppComponent } from "../../app.component";

@Component({
  selector: 'app-home',
  imports: [MatCardModule, BaseChartDirective, TableComponent, AppComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  salaryForMonth!: number;
  dashboardService = inject(DashboardService);
  employeeCount!: number;
  departmentCount!: number;

  public barChartLegend = true;
  public barChartPlugins = [];
  departmentData!: IDepartmentData[];
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Department Count' }],
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };

  ngOnInit() {
    this.dashboardService.getDashboardData().subscribe((result) => {
      this.salaryForMonth = result.totalSalary;
      this.employeeCount = result.employeeCount;
      this.departmentCount = result.departmentCount;
    });

    this.dashboardService.getDepartmentData().subscribe((result) => {
      console.log(result);
      this.barChartData.labels = result.map((x) => x.name);
      this.barChartData.datasets[0].data = result.map((x) => x.employeeCount);
      this.departmentData = result;
    });

    this.dashboardService.getTodayLeaveData().subscribe((result) => {
      console.log(result);
      this.leaveData = {
        data: result,
        totalData: result.length,
      };
    });
  }

  leaveCols = [
    'employeeName',

    {
      key: 'type',
      format: (rowData: ILeave) => {
        switch (rowData.type) {
          case LeaveType.Casual:
            return 'Casual leave';
          case LeaveType.Sick:
            return 'Sick leave';
          case LeaveType.Earned:
            return 'Earned leave';
        }
      },
    },
    {
      key: 'status',
      format: (rowData: ILeave) => {
        switch (rowData.status) {
          case LeaveStatus.Pending:
            return 'Pending';
          case LeaveStatus.Rejected:
            return 'Reject';
          case LeaveStatus.Accepted:
            return 'Accepted';
          case LeaveStatus.Canelled:
            return 'Canelled';
        }
      },
    },
    'reason',
  ];
  leaveData!: PagedData<ILeave>;
}
