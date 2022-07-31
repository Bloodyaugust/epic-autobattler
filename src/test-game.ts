import { v4 } from 'uuid';
import { archer, footman } from './game/data/units';
import { Game, getGameOver, tick } from './game/index';
import { unitFactory } from './game/units';

const game: Game = {
  players: [
    v4(),
    v4(),
  ],
  units: [],
  tick: 0,
  events: [],
};

console.log(`Starting game with players: ${JSON.stringify(game.players)}`);

for (let i = 0; i < 100; i++) {
  game.units.push(unitFactory(archer, game.players[0]));
  game.units.push(unitFactory(Math.random() >= 0.5 ? footman : archer, game.players[1]));
}

console.log(`Team ${game.players[0]} starting with: ${game.units.filter(unit => unit.owner === game.players[0] && unit.name === 'archer').length} archers and ${game.units.filter(unit => unit.owner === game.players[0] && unit.name === 'footman').length} footmen`);
console.log(`Team ${game.players[1]} starting with: ${game.units.filter(unit => unit.owner === game.players[1] && unit.name === 'archer').length} archers and ${game.units.filter(unit => unit.owner === game.players[1] && unit.name === 'footman').length} footmen`);

while (!getGameOver(game)) {
  tick(game);
  console.log(`Game tick ${game.tick}: ${game.events.length} attacks total`);
}

console.log(`${game.units.filter((unit) => unit.health > 0).length} left alive at end of game, ${game.events.reduce((prev, event) => prev + event.damage, 0)} damage done`);
console.log(`${getGameOver(game)?.draw ? 'Game was a draw' : `Winning team was ${getGameOver(game)?.winningTeam}`}`);
