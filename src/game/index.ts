import { Vector } from 'ts-matrix';

type Unit = {
  location: Vector;
  type: string;
  name: string;
  health: number;
  attack: number;
  defense: number;
  moveSpeed: number;
  owner: string;
}

type Game = {
  players: string[];
  units: Unit[];
}


