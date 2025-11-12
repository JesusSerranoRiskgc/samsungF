import { Component, ElementRef, ViewChild } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { ServicioPrincipalService } from '../../Services/main.services';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.scss'
})
export class ReporteComponent {
  @ViewChild('myCanvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>
 
  public view: [number, number] = [600, 300];  // Especifica que es una tupla de dos números
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = true;
  public showXAxisLabel = true;
  public xAxisLabel = 'Área';
  public xAxisLabelusuario = 'Usuarios';
  public xAxisLabelClientes = 'Clientes';
  public xAxisLabelServicios = 'Servicios';
  public showYAxisLabel = true;
  public yAxisLabel = 'Horas';
  public colorSchemeAreas: Color = {
    name: 'customAreas',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5']
  };

  public colorSchemeUsuarios: Color = {
    name: 'customUsuarios',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#109618', '#FF9900', '#DC3912', '#3366CC']
  };

  public colorSchemeClientes: Color = {
    name: 'customClientes',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#8B008B', '#FFD700', '#00BFFF', '#FF6347']
  };

  public colorSchemeServicios: Color = {
    name: 'customServicios',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#2F4F4F', '#FF1493', '#00CED1', '#8B4513']
  };
  public areas: any[] = [];
  public usuarios: any[] = [];
  public cliente: any[] = [];
  public servicio: any[] = [];

  // Datos del gráfico (en este caso, solo un conjunto de datos)
  barChartData: any[] = single;

  constructor(private serviciocliente : ServicioPrincipalService) {
    Object.assign(this, { single });
  }


  ngOnInit(): void {
    this.loadAreas();
    this.loadUsuarios();
    this.loadClientes();
    this.loadServicios();
  }
  loadAreas(): void {
    this.serviciocliente.getReporteArea().subscribe(data => {
      this.areas = data.map((item: any) => {
        return {
          name: item.nombreD,
          value: item.numeroHoras
        };
      });
    });
  }
  loadUsuarios(): void {
    this.serviciocliente.getReporteUsuarios().subscribe(data => {
      this.usuarios = data.map((item: any) => {
        return {
          name: item.nombreD,
          value: item.numeroHoras
        };
      });
    });
  }

  loadClientes(): void {
    this.serviciocliente.getAReporteCliente().subscribe(data => {
      this.cliente = data.map((item: any) => {
        return {
          name: item.nombreD,
          value: item.numeroHoras
        };
      });
    });
  }

  loadServicios(): void {
    this.serviciocliente.getReporteServicio().subscribe(data => {
      this.servicio = data.map((item: any) => {
        return {
          name: item.nombreD,
          value: item.numeroHoras
        };
      });
    });
  }

  onSelect(event: any): void {
    console.log(event);
  }
  onActivate(data:any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data:any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  public doughnutChartLabels: string[] = ['Chorizo', 'Salchichon', 'Mortadela'];
public doughnutChartData: number[] = [35, 45, 100];
public doughnutChartType: string = 'doughnut';

// events
public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
  console.log(event, active);
}

public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
  console.log(event, active);
}

public randomize(): void {

  this.doughnutChartData = [
    Math.round(Math.random() * 100),
    Math.round(Math.random() * 100),
    Math.round(Math.random() * 100)
  ];
}

public barChartOptions = {
  scaleShowVerticalLines: false,
  responsive: true
};

public barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
public barChartType = 'bar';
public barChartLegend = true;

 

}

export var single = [
  {
    "name": "Germany",
    "value": 8940000
  },
  {
    "name": "USA",
    "value": 5000000
  },
  {
    "name": "France",
    "value": 7200000
  }
];



