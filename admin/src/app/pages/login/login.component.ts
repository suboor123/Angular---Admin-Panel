import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { echo } from '@core/lib/echo';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    const auth = localStorage.getItem('authenticate');
    if(auth) {
      this.router.navigate(['/dashboard'])
    }
  }

  authenticate() {
    const val =(((document.getElementById('pw') as any)?.value) || '').trim();
    if(val === 'suboor@7860') {
      localStorage.setItem('authenticate', 'true');
      window.location.reload();
    } else {
      this.toastr.error('Invalid password');
      echo('Invalid password', [
        'password entered ' + val,
        'location sending to the server...',
        'system configuration sending to the server...',
        'want something like this? lets email me at suboork100@gmail.com'
      ])
    }
  }

}
