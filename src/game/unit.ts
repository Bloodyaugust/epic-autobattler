import { v4 } from 'uuid';
import { AttackEvent } from '.';
import { distance, Vector } from './vector';

export type Unit = {
  location: Vector;
  type: string;
  name: string;
  health: number;
  attack: number[];
  defense: number;
  moveSpeed: number;
  range: number;
  owner: string;
  id: string;
}

export type UnitOrNull = Unit | null;

export function attack(attacker: Unit, target: Unit): AttackEvent {
  const damage = (attacker.attack[0] + (Math.random() * (attacker.attack[1] - attacker.attack[0]))) - target.defense;

  return {
    attacker,
    target,
    damage,
  };
}

export function findTarget(targeter: Unit, units: Unit[]): UnitOrNull {
  const validTargets: Unit[] = units.filter((unit) => {
    return unit.id !== targeter.id && unit.owner !== targeter.owner && unit.health > 0 && distance(targeter.location, unit.location) <= targeter.range;
  });

  // if (validTargets.length > 0) {
  //   console.log(`${targeter.id} on team ${targeter.owner} found valid target: ${validTargets[0].id} from team ${validTargets[0].owner}`);
  // }

  return validTargets.length > 0 ? validTargets[Math.floor(Math.random() * validTargets.length)] : null;
}

export function unitFactory(unitDefinition: Unit, owner: string): Unit {
  return {
    ...unitDefinition,
    owner,
    id: v4(),
  };
}
