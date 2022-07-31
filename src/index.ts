import Bao from 'baojs';
import { v4 } from 'uuid';
import { Game } from './game';

const app = new Bao();

const games = {};

app.get('/', (ctx) => {
  return ctx.sendText("OK");
});

app.get('/game/:id', (ctx) => {
  const fetchedGame = games[ctx.params.id];

  if (!fetchedGame) {
    return ctx.sendJson({
      error: 'No game with that ID',
    });
  }

  return ctx.sendJson(fetchedGame);
});

app.post('/game', (ctx) => {
  const newGame: Game = {
    players: [],
    units: [],
    events: [],
    tick: 0,
    id: v4(),
  };

  games[newGame.id] = newGame;

  return ctx.sendJson(newGame);
});

app.listen();
