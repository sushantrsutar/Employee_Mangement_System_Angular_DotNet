import { Component, inject } from '@angular/core';
import { LeaveService } from '../../services/leave.service';
import { PagedData } from '../../types/paged-data';
import { ILeave, LeaveStatus, LeaveType } from '../../types/leave';
import { TableComponent } from '../../components/table/table.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-leaves',
  imports: [TableComponent],
  templateUrl: './leaves.component.html',
  styleUrl: './leaves.component.scss',
})
export class LeavesComponent {
  leaveService = inject(LeaveService);
  authService = inject(AuthService);
  filter = {
    pageIndex: 0,
    pageSize: 5,
  };
  ngOnInit() {
    this.getLeavesData();
    let col = this.showCols.filter((x: any) => x.key !== 'action');
  }

  showCols = [
    'id',
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
    'reason',
    'leaveDate',
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
    {
      key: 'action',
      format: (rowData: ILeave) => {
        if (this.authService.isEmployee) {
          if (rowData.status == LeaveStatus.Pending) return ['Cancel'];
          else [];
        } else if (rowData.status == LeaveStatus.Pending)
          return ['Reject', 'Accept'];
        return [];
      },
    },
  ];
  data!: PagedData<ILeave>;
  getLeavesData() {
    this.leaveService.getLeaves(this.filter).subscribe((result) => {
      this.data = result;
      console.log(this.data);
    });
  }

  pageChange(event: any) {
    console.log(event);
    this.filter.pageIndex = event.pageIndex;
    this.getLeavesData();
  }
  onRowClick(event: any) {
    console.log(event);
    switch (event.btn) {
      case 'Cancel':
        this.leaveService
          .updateLeaveStatus(event.rowData.id, LeaveStatus.Canelled)
          .subscribe(() => {
            this.getLeavesData();
          });
          break;
      case 'Accept':
        this.leaveService
          .updateLeaveStatus(event.rowData.id, LeaveStatus.Accepted)
          .subscribe(() => {
            this.getLeavesData();
          });
          break;
      case 'Reject':
        this.leaveService
          .updateLeaveStatus(event.rowData.id, LeaveStatus.Rejected)
          .subscribe(() => {
            this.getLeavesData();
          });
          break;
      
    }
  }
}
