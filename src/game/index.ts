import { attack, findTarget, ActorUnit } from './unit';

export type AttackEvent = {
  attacker: ActorUnit,
  target: ActorUnit,
  damage: number,
}

export type Game = {
  players: string[];
  units: ActorUnit[];
  tick: number;
  events: AttackEvent[];
}

export type GameOverEvent = {
  draw: boolean,
  winningTeam?: string,
}

export function tick(game: Game): void {
  const attackEvents: AttackEvent[] = [];
  // For every unit, attack another unit in range
  game.units.forEach(unit => {
    if (unit.health > 0) {
      const target = findTarget(unit, game.units);

      if (target) {
        const attackEvent = attack(unit, target);
        attackEvents.push(attackEvent);
        game.events.push(attackEvent);
      }
    }
  });

  attackEvents.forEach((attackEvent) => {
    attackEvent.target.health -= attackEvent.damage;
  });

  game.tick += 1;
}

export function getGameOver(game: Game): GameOverEvent | null {
  const aliveUnits = game.units.filter((unit) => unit.health > 0);
  const aliveTeams = aliveUnits.reduce((teams, unit) => {
    if (!teams.includes(unit.owner)) {
      return [unit.owner, ...teams];
    }

    return teams;
  }, []);

  if (aliveTeams.length > 1) {
    return null;
  }

  return {
    draw: aliveTeams.length === 0,
    winningTeam: aliveTeams[0] || null,
  };
}
