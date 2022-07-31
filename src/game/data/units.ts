import { Unit } from "../unit";

const unitDefaults = {
  owner: '',
  location: { x: 0, y: 0 },
  id: '',
};

export const footman: Unit = {
  ...unitDefaults,
  type: 'melee',
  name: 'footman',
  health: 4,
  attack: [1.5, 2.5],
  defense: 0.75,
  moveSpeed: 1,
  range: 1,
};

export const archer: Unit = {
  ...unitDefaults,
  type: 'ranged',
  name: 'archer',
  health: 2,
  attack: [2.5, 4.5],
  defense: 0.15,
  moveSpeed: 1,
  range: 5,
};
