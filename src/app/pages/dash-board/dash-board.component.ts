import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Color,ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.scss'
})
export class DashBoardComponent {
  @ViewChild('myCanvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>
  gradient = true; 
  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  single: any[];
  view: [number, number] = [480, 300];

  // Configuración del gráfico
  showLegend = true;
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';
  legendPosition: string = 'below';

  showLabels: boolean = true;
  isDoughnut: boolean = false;


  // Datos del gráfico (en este caso, solo un conjunto de datos)
  barChartData: any[] = single;

  constructor() {
    Object.assign(this, { single });
  }


  ngOnInit(): void {
  }
  onSelect(event: any) {
    // Aquí puedes manejar la lógica para el evento select
    console.log('Elemento seleccionado:', event);
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

