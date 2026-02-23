import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalaryService } from '../../../core/services/salary.service';
import { AuthService } from '../../../core/services/auth.service';
import { Salary } from '../../../core/models/salary.model';

@Component({
  selector: 'app-my-salary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-salary.component.html',
  styleUrls: ['./my-salary.component.scss']
})
export class MySalaryComponent implements OnInit {
  salaries: Salary[] = [];
  currentSalary: Salary | null = null;
  loading = true;
  errorMsg = '';

  constructor(private svc: SalaryService, private auth: AuthService) {}

  ngOnInit(): void {
    const uid = this.auth.getUserId();
    this.svc.getByEmployee(uid).subscribe({
      next: r => {
        this.salaries = r.data ?? [];
        this.currentSalary = this.salaries.find(s => s.isCurrent) ?? this.salaries[0] ?? null;
        this.loading = false;
      },
      error: () => { this.errorMsg = 'Failed to load salary data.'; this.loading = false; }
    });
  }

  netSalary(s: Salary): number {
    return (s.basicSalary ?? 0) + (s.bonus ?? 0) - (s.deduction ?? 0);
  }
}
