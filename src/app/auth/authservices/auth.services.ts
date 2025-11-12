import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError, timeout, TimeoutError } from 'rxjs';
import { environment } from '../../../enviroments/environment.prod';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apilistTipoDocumentos: string = 'ListasSeleccion/listaTiposDocumentos2';

  private tokenKey = 'auth_token';
  private apiUrl =`${environment.apiUrl}/auth`;
  constructor(private http: HttpClient, private router: Router,private jwtHelper: JwtHelperService,) { }

  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    const fullUrl = `${this.apiUrl}/login`;


    return this.http.post<any>(fullUrl, loginData).pipe(
      timeout(5000),
      catchError(error => {
        console.error('AuthService - Error en login:', error);
        return this.handleError(error);
      })
    );
  }

  loginByDocument(documento: string, password: string): Observable<any> {
    const loginData = { documento, password };
    const fullUrl = `${this.apiUrl}/loginByDocument`;

    console.log('AuthService - Datos de login por documento:', loginData);
    console.log('AuthService - URL completa:', fullUrl);

    return this.http.post<any>(fullUrl, loginData).pipe(
      timeout(5000),
      catchError(error => {
        console.error('AuthService - Error en login por documento:', error);
        return this.handleError(error);
      })
    );
  }

  recuperacion(usuario: string, CorreoElectronico: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Recuperacion`, { usuario, CorreoElectronico });
  }

  getToken(): string | null {
    const tokenString = localStorage.getItem(this.tokenKey);
  if (!tokenString) {
    return null;  // No hay token almacenado
  }

  try {
    const localestorage = JSON.parse(tokenString);

    const token = localestorage.token.access_token;

    return token;
  } catch (e) {
    console.error('Error parsing token from localStorage', e);
    return null;
  }
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, JSON.stringify(token));
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
   /*  const token = this.getToken();
    // Aquí puedes agregar lógica para verificar si el token es válido, por ejemplo, verificar la expiración.
    return !!token;

    //return true;*/

    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/auth/login']);
  }

  ListaTiposDocumentos(Lang:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apilistTipoDocumentos}?Lang=${Lang}`);
  }

  private handleError(error: HttpErrorResponse | TimeoutError): Observable<never> {
    let errorMessage: string;
    if (error instanceof TimeoutError) {
      // Error de timeout
      errorMessage = 'El servicio no respondió dentro del tiempo esperado.';
    } else if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    return throwError(errorMessage);
  }

}
