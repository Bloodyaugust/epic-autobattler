import { attack, findTarget } from './units';
import { Vector } from './vector';

export type AttackEvent = {
  attacker: Unit,
  target: Unit,
  damage: number,
}

export type Unit = {
  location: Vector;
  type: string;
  name: string;
  health: number;
  attack: number;
  defense: number;
  moveSpeed: number;
  range: number;
  owner: string;
  id: string;
}

export type Game = {
  players: string[];
  units: Unit[];
  tick: number;
  events: AttackEvent[];
}

export function tick(game: Game): void {
  const attackEvents: AttackEvent[] = [];
  // For every unit, attack another unit in range
  game.units.forEach(unit => {
    const target = findTarget(unit, game.units);

    if (target) {
      const attackEvent = attack(unit, target);
      attackEvents.push(attackEvent);
      game.events.push(attackEvent);
    }
  });

  attackEvents.forEach((attackEvent) => {
    attackEvent.target.health -= attackEvent.damage;
  });

  game.tick += 1;
}
