import { Component, OnInit } from '@angular/core';
import { EvalService } from 'src/app/services/eval-service.service';

@Component({
  selector: 'app-mini-max',
  templateUrl: './minimax.component.html',
  styleUrls: ['./minimax.component.css']
})
export class MinimaxComponent implements OnInit {
  selected_depth : number = 1
  constructor(private eval_service : EvalService) {}
  ngOnInit(): void {
    // Subscribe to the currentDepth$ observable
    this.eval_service.currentDepth$.subscribe((depth: number | null) => {
      if (depth !== null) {
        this.selected_depth = depth;  // Update selected_depth when currentDepth$ changes
      }
    });
  }
}
