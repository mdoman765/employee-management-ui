import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { SalaryService } from '../../../core/services/salary.service';
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

  constructor(private svc: SalaryService) {}

  ngOnInit(): void {
    // Use /salaries/my — backend resolves employee by logged-in user's email
    this.svc.getMine()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: r => {
          this.salaries      = r.data ?? [];
          this.currentSalary = this.salaries.find(s => s.isCurrent) ?? this.salaries[0] ?? null;
        },
        error: () => { this.errorMsg = 'Failed to load salary data.'; }
      });
  }

  netSalary(s: Salary): number {
    return (s.basicSalary ?? 0) + (s.bonus ?? 0) - (s.deduction ?? 0);
  }
}
