using EmployeeManagementSystem.Entity;
using EmployeeManagementSystem.Service;
using System.Security.Cryptography;
using System.Text;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace EmployeeManagementSystem.Data
{
    public class DataSeedHelper
    {
        private readonly AppDbContext dbContext;

        public DataSeedHelper(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public void InsertData()
        {


            if (!dbContext.Users.Any())
            {
                var passwordHelper = new PasswordHelper();

                dbContext.Users.Add(new User()
                {
                    Email = "admin@test.com",
                    Password = passwordHelper.HashPassword("12345"),
                    Role = "Admin",
                    ProfileImage = ""
                });
                var emps = new List<Employee>()
                {
                    new Employee()
                    {
                        Name="Emp1",
                        Email = "emp1@test.com",
                        Phone ="11111111",
                        Gender = 1,
                        JoiningDate = DateTime.UtcNow,
                        DateOfBirth = DateTime.UtcNow,
                        LastWorkingDate = DateTime.UtcNow,
                        JobTitle = "Software Engineer",
                        Department = new Department()
                        {
                            Name = "Software Development"
                        },
                        Salary = 10000
                    },
                    new Employee()
                    {
                        Name="Emp2",
                        Email = "emp2@test.com",
                        Phone ="22222222",
                        Gender= 2,
                        JoiningDate = DateTime.UtcNow,
                        DateOfBirth = DateTime.UtcNow,
                        LastWorkingDate = DateTime.UtcNow,
                        JobTitle = "Manager",
                        Department = new Department()
                        {
                            Name = "HR"
                        },

                        Salary = 20000
                    }
                };
                foreach (var emp in emps)
                {
                    dbContext.Users.Add(new User()
                    {
                        Email = emp.Email,
                        Password = passwordHelper.HashPassword("12345"),
                        Role = "Employee",
                        ProfileImage = ""
                    });
                    dbContext.SaveChanges();
                    var userid = dbContext.Users.First(x => x.Email == emp.Email);
                    dbContext.Employees.Add(new Employee()
                    {
                        Name = emp.Name,
                        Phone = emp.Phone,
                        Email = emp.Email,
                        UserId = userid.Id,
                        Gender = emp.Gender,
                        LastWorkingDate = emp.LastWorkingDate,
                        DateOfBirth = emp.DateOfBirth,
                        JoiningDate = emp.JoiningDate,
                        JobTitle = emp.JobTitle,
                        Department = emp.Department,
                        Salary = emp.Salary
                    });

                    dbContext.SaveChanges();

                    var empid = dbContext.Employees.First(x => x.Email == emp.Email).Id;
                    dbContext.Attendances.Add(new Attendance()
                    {
                        EmployeeId = empid,
                        Date = DateTime.Now.Subtract(TimeSpan.FromDays(2)),
                        Type = (int)AttendanceType.Present,
                    });
                    dbContext.Leaves.Add(new Leave()
                    {
                        EmployeeId = empid,
                        LeaveDate = DateTime.Now,
                        Type = (int)LeaveType.Casual,
                        Reason = "Going Out",
                        Status = (int)LeaveStatus.Pending
                    });
                    dbContext.SaveChanges();
                }
            }



        }
    }
}
