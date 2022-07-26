import { v4 } from 'uuid';
import { distance, translate, Vector } from "./vector";
import { ActorUnit, attack, findTarget, Unit } from './unit';
import { AttackEvent, Game, getGameOver, tick } from ".";

const defaultGameData = {
  players: [],
  units: [],
  tick: 0,
  events: [],
  id: v4(),
};

const defaultUnitData = {
  type: 'test',
  name: 'test',
  health: 1,
  attack: [1, 1],
  defense: 1,
  moveSpeed: 1,
  range: 1,
  cooldown: 0,
};

const defaultVectorData = {
  x: 0,
  y: 0,
};

const defaultPlayers = [
  v4(),
  v4(),
];

describe('Unit', () => {
  it('can be created', () => {
    const testUnit: Unit = {
      ...defaultUnitData,
    };

    expect(testUnit.health).toBe(1);
  });
});

describe('UnitActor', () => {
  it('can be used to attack', () => {
    const game: Game = {
      ...defaultGameData,
    };
    const attacker: ActorUnit = new ActorUnit({
      ...defaultUnitData,
      attack: [2, 2],
    }, game, defaultPlayers[0]);
    const target: ActorUnit = new ActorUnit({
      ...defaultUnitData,
    }, game, defaultPlayers[1]);

    const attackEvent: AttackEvent = attack(attacker, target);

    expect(attackEvent.damage).toBe(1);

    attacker.data.attack = [2, 5];
    const attackEvents: AttackEvent[] = [];
    for (let i = 0; i < 1000; i++) {
      attackEvents.push(attack(attacker, target));
    }
    console.log(`
    Attacks >= 3 damage: ${attackEvents.filter(event => event.damage >= 3).length}
    Attacks >= 3.5 damage: ${attackEvents.filter(event => event.damage >= 3.5).length}
    Attacks >= 3.9 damage: ${attackEvents.filter(event => event.damage >= 3.9).length}
    `)
    expect(attackEvents.reduce((totalDamage, event) => totalDamage + event.damage, 0) / attackEvents.length).toBeGreaterThan(2.1);
  });

  it('can get target', () => {
    const game: Game = {
      ...defaultGameData,
    };
    const attacker: ActorUnit = new ActorUnit({
      ...defaultUnitData,
      attack: [2, 2],
    }, game, defaultPlayers[0]);
    const target: ActorUnit = new ActorUnit({
      ...defaultUnitData,
    }, game, defaultPlayers[1], { x: 1, y: 0 });
    target.id = 'test2-id';

    let newTarget = findTarget(attacker, [attacker, target]);

    expect(newTarget.id).toBe('test2-id');
    expect(newTarget).not.toBe(attacker);
    expect(newTarget).toBe(target);

    target.location = { x: 2, y: 0 };
    newTarget = findTarget(attacker, [attacker, target]);

    expect(newTarget).toBe(null);

    target.location = { x: 1, y: 0 };
    target.owner = attacker.owner;
    newTarget = findTarget(attacker, [attacker, target]);

    expect(newTarget).toBe(null);
  });
});

describe('Game', () => {
  it('can be created', () => {
    const testGame: Game = {
      ...defaultGameData,
    };

    expect(testGame.tick).toBe(0);
  });

  it('can be ticked', () => {
    const testGame: Game = {
      ...defaultGameData,
      units: [],
    };
    testGame.units = [
      new ActorUnit({
        ...defaultUnitData,
      }, testGame, defaultPlayers[0]),
      new ActorUnit({
        ...defaultUnitData,
        attack: [2, 2],
      }, testGame, defaultPlayers[1], { x: 1, y: 0 }),
    ];

    tick(testGame);

    expect(testGame.tick).toBe(1);
    expect(testGame.units[0].health).toBe(0);
    expect(testGame.events.length).toBe(2);
    expect(testGame.events[0].damage).toBe(0);
    expect(testGame.events[1].damage).toBe(1);
  });

  it('can be decided', () => {
    const testGame: Game = {
      ...defaultGameData,
      units: [],
    };
    testGame.units = [
      new ActorUnit({
        ...defaultUnitData,
        health: 10,
      }, testGame, defaultPlayers[0]),
      new ActorUnit({
        ...defaultUnitData,
        attack: [2, 2],
      }, testGame, defaultPlayers[1], { x: 1, y: 0 }),
    ];
    testGame.units[1].owner = 'test2-player';

    while (!getGameOver(testGame)) {
      tick(testGame);
    }

    expect(getGameOver(testGame)?.winningTeam).toBe('test2-player');

    testGame.units = [
      new ActorUnit({
        ...defaultUnitData,
        attack: [2, 2],
      }, testGame, defaultPlayers[0]),
      new ActorUnit({
        ...defaultUnitData,
        attack: [2, 2],
      }, testGame, defaultPlayers[1]),
    ];
    tick(testGame);

    expect(getGameOver(testGame)?.draw).toBe(true);

    testGame.units = [
      new ActorUnit({
        ...defaultUnitData,
      }, testGame, defaultPlayers[0]),
      new ActorUnit({
        ...defaultUnitData,
      }, testGame, defaultPlayers[1]),
    ];
    tick(testGame);

    expect(getGameOver(testGame)).toBe(null);
  });
});

describe('Vector', () => {
  it('can be created', () => {
    const testVector: Vector = {
      ...defaultVectorData,
    };

    expect(testVector.x).toBe(0);
    expect(testVector.y).toBe(0);
  });

  it('can get distance', () => {
    const vec1: Vector = {
      ...defaultVectorData,
    };
    const vec2: Vector = {
      x: 1,
      y: 2,
    };
    
    const d = distance(vec1, vec2);

    expect(d).toBeCloseTo(2.236);
  });

  it('can get translated', () => {
    const vec1: Vector = {
      x: 0,
      y: 1,
    };
    const vec2: Vector = {
      x: 1,
      y: 2,
    };
    
    const translated = translate(vec1, vec2);

    expect(translated.x).toBe(1);
    expect(translated.y).toBe(3);
  });
});
