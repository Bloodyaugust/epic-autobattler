import { AttackEvent, Unit } from './';
import { distance } from './vector';

export type UnitOrNull = Unit | null;

export function attack(attacker: Unit, target: Unit): AttackEvent {
  const damage = attacker.attack - target.defense;

  return {
    attacker,
    target,
    damage,
  };
}

export function findTarget(targeter: Unit, units: Unit[]): UnitOrNull {
  const validTargets: Unit[] = units.filter((unit) => {
    return unit.id !== targeter.id && unit.owner !== targeter.owner && distance(targeter.location, unit.location) <= targeter.range;
  });

  return validTargets.length > 0 ? validTargets[0] : null;
}
