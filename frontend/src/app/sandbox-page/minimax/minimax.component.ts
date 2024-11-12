import { Component, OnInit } from '@angular/core';
import { EvalService } from 'src/services/eval-service.service';

@Component({
  selector: 'app-mini-max',
  templateUrl: './minimax.component.html',
  styleUrls: ['./minimax.component.css']
})
export class MinimaxComponent implements OnInit {
  selected_depth : number = 1
  constructor(private eval_service : EvalService) {}
  ngOnInit(): void {
    this.eval_service.updateDepth(this.selected_depth)
  }
  onDepthChange(newDepth: number): void {
    this.selected_depth = newDepth;
    this.eval_service.updateDepth(this.selected_depth);
  }
}
