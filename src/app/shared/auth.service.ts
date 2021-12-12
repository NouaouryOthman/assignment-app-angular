import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = false;

  constructor(private router:Router) { }


  user = {
    email: "admin@admin.com",
    password: "testadmin123",
    isAdmin: true
  }

  logIn(email:string, password:string) {
    // dans la vraie vie, on devrait ici passer un login et un password
    // puis envoyer une requête sur un web service distant qui va
    // vérifier si login/password sont ok (dans une BD ou via le
    // service oAuth par exemple), et si ok, alors on met loggedIn à true
    // sinon on redirige vers la page de connexion avec un message d'erreur

    // nous on simplifie pour le moment.
    if (email == this.user.email && password == this.user.password){
      this.loggedIn = true;
      this.router.navigate(['/home']);
    }
  }

  logOut() {
    // typiquement : appelé par le bouton de deconnexion...
    this.loggedIn = false;
  }

  isLoggedIn(){
    return this.loggedIn;
  }

  isAdmin() {
    // renvoie true ou false juste si on est connecté/deconnecté
    return new Promise((resolve, reject) => {
      resolve(this.loggedIn);
    });
  }
}
