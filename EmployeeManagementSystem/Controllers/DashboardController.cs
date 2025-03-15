using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.Entity;
using EmployeeManagementSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IRepository<Employee> empRepo;
        private readonly IRepository<Department> depRepo;
        private readonly IRepository<Leave> leaveRepo;

        public DashboardController(IRepository<Employee> empRepo,
            IRepository<Department> depRepo,
            IRepository<Leave> leaveRepo)
        {
            this.empRepo = empRepo;
            this.depRepo = depRepo;
            this.leaveRepo = leaveRepo;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> TotalSalary()
        {
            var empList = await empRepo.GetAll();
            var totalSalary = empList.Sum(x => x.Salary ?? 0);
            var employeeCount = empList.Count;
            var depList = await depRepo.GetAll();
            var departmentCount = depList.Count;
            return Ok(new
            {
                TotalSalary = totalSalary,
                employeeCount = employeeCount,
                departmentCount = departmentCount
            });
        }
        [HttpGet("department-data")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetDepartmentData()
        {
            var depList = await depRepo.GetAll();
            var empList = await empRepo.GetAll();
            var result = empList.GroupBy(x => x.DepartmentId).Select(y => new DepartmentDataDto()
            {
                Name = depList.FirstOrDefault(z => z.Id == y.Key)?.Name!,
                EmployeeCount = y.Count(),
            });
            return Ok(result);
        }
        [HttpGet("employee-leave-today")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetEmployeeOnLeave()
        {
            var onLeaveList = await leaveRepo.GetAll(x =>
            DateTime.Compare(x.LeaveDate.Date, DateTime.UtcNow.Date) == 0);
            var employeeIds = onLeaveList.Select(x => x.EmployeeId).ToList();
            var employeeList = await empRepo.GetAll(x => employeeIds.Contains(x.Id));
            var employeeOnLeave = onLeaveList.Select(x => new LeaveDto()
            {
                EmployeeId = x.Id,
                Reason = x.Reason,
                Type = x.Type,
                Status = x.Status,
                EmployeeName = employeeList.FirstOrDefault(y => y.Id == x.EmployeeId)?.Name!
            }).ToList();
            return Ok(employeeOnLeave);
        }

    }
}
