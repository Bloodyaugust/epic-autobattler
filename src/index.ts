import Bao from "baojs";

const app = new Bao();

app.get("/", (ctx) => {
  return ctx.sendText("OK");
});

app.listen();
