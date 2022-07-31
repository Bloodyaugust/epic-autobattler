import { distance, translate, Vector } from "./vector";
import { attack, findTarget } from './units';
import { AttackEvent, Game, tick, Unit } from ".";

const defaultGameData = {
  players: [],
  units: [],
  tick: 0,
  events: [],
};

const defaultUnitData = {
  location: { x: 0, y: 0 },
  type: 'test',
  name: 'test',
  health: 1,
  attack: 1,
  defense: 1,
  moveSpeed: 1,
  owner: 'test-player',
  range: 1,
  id: 'test-id',
};

const defaultVectorData = {
  x: 0,
  y: 0,
};

describe('Unit', () => {
  it('can be created', () => {
    const testUnit: Unit = {
      ...defaultUnitData,
    };

    expect(testUnit.location.x).toBe(0);
  });

  it('can be used to attack', () => {
    const attacker: Unit = {
      ...defaultUnitData,
      attack: 2,
    };
    const target: Unit = {
      ...defaultUnitData,
    };

    const attackEvent: AttackEvent = attack(attacker, target);

    expect(attackEvent.damage).toBe(1);
  });

  it('can get target', () => {
    const attacker: Unit = {
      ...defaultUnitData,
    };
    const target: Unit = {
      ...defaultUnitData,
      location: { x: 1, y: 0 },
      id: 'test2-id',
      owner: 'test2-player',
    };

    const newTarget = findTarget(attacker, [attacker, target]);

    expect(newTarget.id).toBe('test2-id');
    expect(newTarget).not.toBe(attacker);
    expect(newTarget).toBe(target);
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
      units: [
        {
          ...defaultUnitData,
        },
        {
          ...defaultUnitData,
          location: { x: 1, y: 0 },
          id: 'test2-id',
          owner: 'test2-player',
          attack: 2,
        },
      ],
    };

    tick(testGame);

    expect(testGame.tick).toBe(1);
    expect(testGame.units[0].health).toBe(0);
    expect(testGame.events.length).toBe(2);
    expect(testGame.events[0].damage).toBe(0);
    expect(testGame.events[1].damage).toBe(1);
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
