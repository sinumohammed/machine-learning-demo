import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import {
  Label,
  SingleDataSet,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
  Color
} from 'ng2-charts';
import * as tf from '@tensorflow/tfjs';

export interface TeamInterface {
  value: any;
  viewValue: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'machine-learning-app';

  // Sample Data to display in chart

  chartData1 = [7, 3];
  chartData2 = [8, 2];
  chartData3 = [4, 6];

  public pieChartOptions: ChartOptions = {
    responsive: true
  };
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  public pieChartLabels1: Label[] = ['Team A', 'Team B'];
  public pieChartData1: SingleDataSet = this.chartData1;

  public pieChartLabels2: Label[] = ['Team B', 'Team C'];
  public pieChartData2: SingleDataSet = this.chartData2;

  public pieChartLabels3: Label[] = ['Team A', 'Team C'];
  public pieChartData3: SingleDataSet = this.chartData3;

  public pieChartColors1: Color[] = [
    {
      backgroundColor: ['blue', 'lightblue']
    }
  ];
  public pieChartColors2: Color[] = [
    {
      backgroundColor: ['lightblue', 'green']
    }
  ];
  public pieChartColors3: Color[] = [
    {
      backgroundColor: ['blue', 'green']
    }
  ];

  constructor() {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  // Machine Learning code

  // Machine Learning sequential model
  model = tf.sequential();

  // Sample Input Data for training
  input = [
    [0, 1],
    [1, 2],
    [0, 2],
    [0, 1],
    [1, 2],
    [0, 2],
    [0, 1],
    [1, 2],
    [0, 2],
    [0, 1],
    [1, 2],
    [0, 2],
    [0, 1],
    [1, 2],
    [0, 2],
    [0, 1],
    [1, 2],
    [0, 2],
    [0, 1],
    [1, 2],
    [0, 2],
    [0, 1],
    [1, 2],
    [0, 2],
    [0, 1],
    [1, 2],
    [0, 2],
    [0, 1],
    [1, 2],
    [0, 2]
  ];
  inputTensor = tf.tensor(this.input);

  // Sample Output from training
  output = [
    'A',
    'B',
    'A',
    'A',
    'C',
    'A',
    'A',
    'B',
    'C',
    'A',
    'C',
    'C',
    'A',
    'B',
    'A',
    'B',
    'B',
    'C',
    'A',
    'B',
    'C',
    'B',
    'B',
    'C',
    'A',
    'B',
    'A',
    'B',
    'B',
    'C'
  ];
  category = ['A', 'B', 'C'];
  setLabel = Array.from(new Set(this.category));

  // Y axis based on output data
  ys = tf.oneHot(
    tf.tensor1d(
      this.output.map(a => this.setLabel.findIndex(e => e === a)),
      'int32'
    ),
    3
  );

  // User dropdown option to select teams for match
  predictTeam: TeamInterface[] = [
    { value: [0, 1], viewValue: 'Team A vs Team B' },
    { value: [1, 2], viewValue: 'Team B vs Team C' },
    { value: [0, 2], viewValue: 'Team A vs Team C' }
  ];
  selectedTeam = [0, 1];
  result = '';
  resultA = 0;
  resultB = 0;
  resultC = 0;

  modelTrained = false;

  // Add more sample
  sampleData: TeamInterface[] = [
    {
      value: { id: 1, inputVal: [0, 1], possibleOutput: ['A', 'B'] },
      viewValue: 'Team A vs Team B'
    },
    {
      value: { id: 2, inputVal: [1, 2], possibleOutput: ['B', 'C'] },
      viewValue: 'Team B vs Team C'
    },
    {
      value: { id: 3, inputVal: [0, 2], possibleOutput: ['A', 'C'] },
      viewValue: 'Team A vs Team C'
    }
  ];

  selectedSample = { id: 0, inputVal: [], possibleOutput: [] };
  selectedResult = '';
  ngOnInit() {
    this.createModel();
    this.trainModel();
  }
  addSample() {
    console.log(this.selectedResult);
    console.log(this.selectedSample + '--' + this.selectedSample.id);
    if (this.selectedSample.id > 0  && this.selectedResult !== '')  {
      this.input.push(this.selectedSample.inputVal);
      this.output.push(this.selectedResult);
      this.inputTensor = tf.tensor(this.input);
      this.ys = tf.oneHot(
        tf.tensor1d(
          this.output.map(a => this.setLabel.findIndex(e => e === a)),
          'int32'
        ),
        3
      );
      console.log(this.selectedSample.inputVal);
      if (this.selectedSample.id === 1) {
        if (this.selectedResult === 'A') {
          this.chartData1[0] ++;
        } else {
          this.chartData1[1] ++;
        }
        this.pieChartData1 = [...this.chartData1];
      }
      if (this.selectedSample.id === 2) {
        if (this.selectedResult === 'B') {
          this.chartData2[0] ++;
        } else {
          this.chartData2[1] ++;
        }
        this.pieChartData2 = [...this.chartData2];
      }
      if (this.selectedSample.id === 3) {
        if (this.selectedResult === 'A') {
          this.chartData3[0] ++;
        } else {
          this.chartData3[1] ++;
        }
        this.pieChartData3 = [...this.chartData3];
      }
    }
  }

  // Creatiing and compiling machine learning model with three sequential layers
  private createModel() {
    this.model.add(
      tf.layers.dense({ units: 100, inputShape: [2], activation: 'sigmoid' })
    );
    this.model.add(tf.layers.dense({ units: 10, activation: 'sigmoid' }));
    this.model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));
    this.model.compile({ loss: 'categoricalCrossentropy', optimizer: 'adam' });
  }

  // Training model with sample data and epchs of 500
  trainModel() {
    this.modelTrained = false;
    this.model
      .fit(this.inputTensor, this.ys, { epochs: 500 })
      .then(loss => {
        this.modelTrained = true;
      })
      .catch(e => {
        console.log(e.message);
      });
  }

  // Prediction function

  prediction() {
   // this.result = '';
    console.log(this.selectedTeam);
    const predictTs = tf.tensor([this.selectedTeam]);
    const t = this.model.predict(predictTs) as tf.Tensor;
    const pred = t.argMax(1).dataSync(); // get the class of highest probability
    const labelsPred = Array.from(pred).map((e: any) => this.setLabel[e]);
    this.result = 'Team ' + labelsPred[0];
    console.log(labelsPred);
  }
}
