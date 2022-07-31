import { v4 } from 'uuid';
import { AttackEvent, Game } from '.';
import { distance, Vector } from './vector';

export type Unit = {
  type: string;
  name: string;
  health: number;
  attack: number[];
  cooldown: number;
  defense: number;
  moveSpeed: number;
  range: number;
}

export class ActorUnit {
  data: Unit;
  game: Game;
  target?: ActorUnit;
  cooldownTicks: number;
  health: number;
  location: Vector;
  owner: string;
  id: string;

  constructor(unit: Unit, game: Game, owner: string, location: Vector = { x: 0, y: 0 }) {
    this.data = unit;
    this.game = game;
    this.cooldownTicks = 0;
    this.health = this.data.health;
    this.location = location;
    this.owner = owner;
    this.id = v4();
  }

  tick() {
    if (this.health <= 0) {
      return;
    }

    if (this.cooldownTicks > 0) {
      this.cooldownTicks--;
    }

    if (!this.target) {
      this.target = findTarget(this, this.game.units);
    }
  }
}

export function attack(attacker: ActorUnit, target: ActorUnit): AttackEvent {
  const damage = (attacker.data.attack[0] + (Math.random() * (attacker.data.attack[1] - attacker.data.attack[0]))) - target.data.defense;

  return {
    attacker,
    target,
    damage,
  };
}

export function findTarget(targeter: ActorUnit, units: ActorUnit[]): ActorUnit | null {
  const validTargets: ActorUnit[] = units.filter((unit) => {
    return unit.id !== targeter.id && unit.owner !== targeter.owner && unit.health > 0 && distance(targeter.location, unit.location) <= targeter.data.range;
  });

  // if (validTargets.length > 0) {
  //   console.log(`${targeter.id} on team ${targeter.owner} found valid target: ${validTargets[0].id} from team ${validTargets[0].owner}`);
  // }

  return validTargets.length > 0 ? validTargets[Math.floor(Math.random() * validTargets.length)] : null;
}

export function unitFactory(unitDefinition: Unit, game: Game, owner: string): ActorUnit {
  return new ActorUnit(unitDefinition, game, owner);
}
