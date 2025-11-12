import { Component } from '@angular/core';
import { AuthService } from '../../auth/authservices/auth.services';
import { ServicioPrincipalService } from '../Services/main.services';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-layaout',
  templateUrl: './layaout.component.html',
  styleUrl: './layaout.component.scss'
})
export class LayaoutComponent {
  sidebarOpen = false;
  usuario = '';
  rol = '';
  idiomaActual: any = '';
  menuItems: any[] = [];

  menuItemsAdmin = [
    {
      "label": "Dashboard",
      "icon": "bi bi-speedometer2", // "icon"o de dashboard (ejemplo)
      "link": "Reporte" // Ruta hacia la página de dashboard

    },
    {
      "label": "Usuarios",
      "icon": "bi bi-person-lines-fill", // "icon"o de servicios (ejemplo)
      "children": [
        {
          "label": "Listar Usuario",
          "icon": "bi bi-people-fill", // "icon"o de listar servicios (ejemplo)
          "link": "ListaUsuarios" // Ruta hacia la página de listar servicios
        },
        {
          "label": "Crear Usuario",
          "icon": "bi bi-plus-circle", // "icon"o de crear servicios (ejemplo)
          "link": "CrearUsuarios" // Ruta hacia la página de crear servicios
        }
      ]
    },
    {
      "label": "Área",
      "icon": "bi bi-layout-text-sidebar", // "icon"o de área (ejemplo)
      "children": [
        {
          "label": "Listar Área",
          "icon": "bi bi-list", // "icon"o de listar área (ejemplo)
          "link": "ListaAreas" // Ruta hacia la página de listar área
        },
        {
          "label": "Crear Área",
          "icon": "bi bi-plus", // "icon"o de crear área (ejemplo)
          "link": "NewArea" // Ruta hacia la página de crear área
        }
      ]
    },
    {
      "label": "Cliente",
      "icon": "bi bi-person-video2", // "icon"o de cliente (ejemplo)
      "children": [
        {
          "label": "Listar Cliente",
          "icon": "bi bi-person-lines-fill", // "icon"o de listar cliente (ejemplo)
          "link": "ListaClientes" // Ruta hacia la página de listar cliente
        },
        {
          "label": "Crear Cliente",
          "icon": "bi bi-person-plus", // "icon"o de crear cliente (ejemplo)
          "link": "NewClientes" // Ruta hacia la página de crear cliente
        }
      ]
    },
    {
      "label": "Servicios",
      "icon": "bi bi-server", // "icon"o de servicios (ejemplo)
      "children": [
        {
          "label": "Listar Servicios",
          "icon": "bi bi-list-check", // "icon"o de listar servicios (ejemplo)
          "link": "ListaServicios" // Ruta hacia la página de listar servicios
        },
        {
          "label": "Crear Servicios",
          "icon": "bi bi-plus-circle", // "icon"o de crear servicios (ejemplo)
          "link": "CreaServicio" // Ruta hacia la página de crear servicios
        }
      ]
    }
    ,
    {
      "label": "Actividades",
      "icon": "bi bi-gear", // "icon"o de servicios (ejemplo)
      "children": [
        {
          "label": "Listar Actividades",
          "icon": "bi bi-list-check", // "icon"o de listar servicios (ejemplo)
          "link": "ListaActividades" // Ruta hacia la página de listar servicios
        },
        {
          "label": "Crear Actividad",
          "icon": "bi bi-plus-circle", // "icon"o de crear servicios (ejemplo)
          "link": "NewActividad" // Ruta hacia la página de crear servicios
        }
      ]
    },
    {
      "label": "Registro Tiempos",
      "icon": "bi bi-smartwatch", // "icon"o de servicios (ejemplo)
      "children": [
        {
          "label": "Listar Registros",
          "icon": "bi bi-list-check", // "icon"o de listar servicios (ejemplo)
          "link": "ListaRegistros" // Ruta hacia la página de listar servicios
        },
        {
          "label": "Crear Registro",
          "icon": "bi bi-plus-circle", // "icon"o de crear servicios (ejemplo)
          "link": "NuevoRegistro" // Ruta hacia la página de crear servicios
        }
      ]
    },
  ];

  sUsuarioES = [

    {
      "label": "Registro Formularios",
      "icon": "bi bi-smartwatch", // "icon"o de servicios (ejemplo)
      "children": [
        {
          "label": "Listar Formularios",
          "icon": "bi bi-list-check", // "icon"o de listar servicios (ejemplo)
          "link": "ListaFormulariosUsuario" // Ruta hacia la página de listar servicios
        }
      ]
    },
  ];

  usuarioEN = [

    {
      "label": "Registration Forms",
      "icon": "bi bi-smartwatch", // "icon"o de servicios (ejemplo)
      "children": [
        {
          "label": "Forms List",
          "icon": "bi bi-list-check", // "icon"o de listar servicios (ejemplo)
          "link": "ListaFormulariosUsuario" // Ruta hacia la página de listar servicios
        }
      ]
    },
  ];



  menuAsminsUser = [
    {
      "label": "Formularios",
      "icon": "bi bi-list-check", // Ícono de formularios
      "link": "ListaFormulariosUsuario",
      "children": []
    },
    {
      "label": "Usuarios",
      "icon": "bi bi-person-lines-fill", // "icon"o de servicios (ejemplo)
      "children": [
        {
          "label": "Listar Usuario",
          "icon": "bi bi-people-fill", // "icon"o de listar servicios (ejemplo)
          "link": "ListaUsuarios" // Ruta hacia la página de listar servicios
        },
        {
          "label": "Crear Usuario",
          "icon": "bi bi-plus-circle", // "icon"o de crear servicios (ejemplo)
          "link": "CrearUsuarios" // Ruta hacia la página de crear servicios
        }
      ]
    },
    {
      "label": "Reporte",
      "icon": "bi bi-file-bar-graph",
      "link": "ReporteFiltros",
      "children": []

    }//dash/ReporteFiltros
  ];



  constructor(private servicioautht: AuthService, private serviciocliente: ServicioPrincipalService, private router: Router, private translateService: TranslateService) {
    this.idiomaActual = this.translateService.currentLang || this.translateService.getBrowserLang();

  }


  ngOnInit(): void {//supermenuItemsAdminEN
    /* this.serviciocliente.CurrentUser().pipe(
       catchError((error) => {
         this.servicioautht.logout();
         return of(null);
       })
     ).subscribe((data: any) => {
       if (data) {
         this.usuario = data.nombre + ' ' + data.apellido;
 
         if (data.rol === 'Proveedor/Cliente' && this.idiomaActual === "es") {
           this.menuItems = this.sUsuarioES;
         } else if (data.rol === 'Proveedor/Cliente' && this.idiomaActual === "en") {
           this.menuItems = this.usuarioEN;
         } else {
           this.menuItems = this.menuAsminsUser;
         }
 
         if (data.actualizarPass) {
           this.router.navigate(['/pages/dash/ActualizarPass']);
         }
       }else
       {
         this.servicioautht.logout();
       }
     });*/

    this.serviciocliente.CurrentUser().subscribe((data: any) => {
      if (data) {
        this.usuario = data.nombre + ' ' + data.apellido;
        this.rol = data.rol || 'Usuario';
        if (this.rol==="Control Interno") {
           this.rol ="VerificadorCumplimiento";
        }
        if (this.rol==="Contabilidad") {
           this.rol ="VerificadorDatos";
        }
        if (data.rol === 'Proveedor/Cliente' && this.idiomaActual === "es") {
          this.menuItems = this.sUsuarioES;
        } else if (data.rol === 'Proveedor/Cliente' && this.idiomaActual === "en") {
          this.menuItems = this.usuarioEN;
        } else {
          this.menuItems = this.menuAsminsUser;
        }

        if (data.actualizarPass) {
          this.router.navigate(['/pages/dash/ActualizarPass']);
        }
      } else {
        this.servicioautht.logout();
      }
    });



  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
  //ListaActividades
  signOut() {

    this.servicioautht.clearToken(); 

  
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');

    // 3️⃣ Opcional: borrar todo el storage si no guardas más datos
    localStorage.clear();
    sessionStorage.clear();

    // 4️⃣ Si tienes un interceptor que añade Authorization,
    //    limpia el header Authorization globalmente
    // (depende de cómo implementaste el interceptor)
    // Por ejemplo:
    // this.http.defaults.headers.common['Authorization'] = '';

    // 5️⃣ Redirigir al login
    this.router.navigate(['/auth/login']).then(() => {
      // 6️⃣ Forzar recarga para reiniciar toda la app Angular
      location.reload();
    });
  }


  myaccount() {
    this.router.navigate(['/pages/dash/MiCuentaComponent']);
  }

  area = {
    nombre: '',
    jefe: '',
    descripcion: '',
    empleados: 0
  };

  onSubmit() {
    console.log('Área guardada:', this.area);
    // Aquí puedes añadir la lógica para enviar los datos al servidor
  }
}
