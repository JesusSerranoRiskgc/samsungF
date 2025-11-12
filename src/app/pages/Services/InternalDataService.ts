import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InternalDataService {
  private user: any;
  private area: any;
  private Actividad: any;
  private Cliente: any;
  private ServicioPrestado: any;
  private ResgistroTiempo: any;
  private NuevoFormulario:any;
  private idClaseTercero:string;
  

  setUser(user: any) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }
  setArea(area: any) {
    this.area = area;
  }

  getArea() {
    return this.area;
  }


  setActividad(actividad: any) {
    this.Actividad = actividad;
  }

  getActividad() {
    return this.Actividad;
  }

  setCliente(cliente: any) {
    this.Cliente = cliente;
  }

  getCliente() {
    return this.Cliente;
  }//ResgistroTiempo

  setServicioP(servicio: any) {
    this.ServicioPrestado = servicio;
  }

  getsERVICIO() {
    return this.ServicioPrestado;
  }
  setResgistroTiempo(registrotiempo: any) {
    this.ResgistroTiempo = registrotiempo;
  }

  getResgistroTiempo() {
    return this.ResgistroTiempo;
  }

  setNuevoFormulario(NuevoForm: any) {
    this.NuevoFormulario = NuevoForm;
    //localStorage.setItem('NuevoFormulario', JSON.stringify(NuevoForm));
  }

  getNuevoFormulario() {
    /*if (!this.NuevoFormulario) {
      const storedData = localStorage.getItem('NuevoFormulario');
      this.NuevoFormulario = storedData ? JSON.parse(storedData) : null;
    }*/
    return this.NuevoFormulario;
  }

  setIdClaseTercero(idClaseTercero: string) {
    this.idClaseTercero = idClaseTercero;
  }

  getClasetercero() {
    return this.idClaseTercero;
  }

}