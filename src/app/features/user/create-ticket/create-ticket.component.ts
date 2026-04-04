import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { TicketService } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss']
})
export class CreateTicketComponent {
  form: FormGroup; saving = false; errorMsg = '';

  constructor(private fb: FormBuilder, private svc: TicketService, private router: Router) {
    this.form = this.fb.group({
      title:       ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get f() { return this.form.controls; }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.errorMsg = '';
    this.svc.create(this.form.value)
      .pipe(finalize(() => this.saving = false))
      .subscribe({
        next: () => { this.router.navigate(['/user/my-tickets']); },
        error: err => { this.errorMsg = err?.error?.message ?? 'Failed to submit ticket.'; }
      });
  }
}
