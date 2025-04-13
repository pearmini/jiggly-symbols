import {render} from "./render.js";

const seed = process.env.NODE_ENV === "development" ? 1744570991909 : Date.now();

document.getElementById("app").appendChild(render({seed}));
