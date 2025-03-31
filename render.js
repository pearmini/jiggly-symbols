import {interpolate as interpolatePath} from "flubber";
import {cm, d3} from "./namespaces.js";

const COLORS = [
  d3.interpolateViridis,
  d3.interpolateInferno,
  d3.interpolateMagma,
  d3.interpolatePlasma,
  d3.interpolateWarm,
  d3.interpolateCool,
  d3.interpolateRainbow,
  d3.interpolateCubehelixDefault,
  d3.interpolateBlues,
  d3.interpolateGreens,
  d3.interpolateGreys,
  d3.interpolateOranges,
  d3.interpolatePurples,
  d3.interpolateReds,
  d3.interpolateBuGn,
  d3.interpolateBuPu,
  d3.interpolateGnBu,
  d3.interpolateOrRd,
  d3.interpolatePuBuGn,
  d3.interpolatePuBu,
  d3.interpolatePuRd,
  d3.interpolateRdPu,
  d3.interpolateYlGnBu,
  d3.interpolateYlGn,
  d3.interpolateYlOrBr,
  d3.interpolateYlOrRd,
];

const SYMBOLS = [cm.symbolX, cm.symbolCircle, cm.symbolDiamond, cm.symbolSquare];

export function render(container) {
  const size = 640;
  const shapes = [];
  const random = d3.randomUniform(-25, 25);
  let [dx0, dy0, dx1, dy1, i0, i1, j0, j1] = [0, 0, 0, 0, 0, 0, 0, 0];

  drawShape(size / 2, size / 2, 150);

  const input = d3.extent(shapes.map((d) => d.r)).reverse();
  const scale = (i) => d3.scaleSequential(input, COLORS[i]);

  function drawShape(x, y, r) {
    if (r < 4) return;
    shapes.push({x, y, r});
    drawShape(x, y, r - 15);
  }

  function draw({frameCount}) {
    if (frameCount !== 0) {
      [dx0, dy0] = [dx1, dy1];
      [dx1, dy1] = [random(), random()];
      [i0, i1] = [i1, frameCount === 1 ? 0 : d3.randomInt(COLORS.length)()];
      [j0, j1] = [j1, frameCount === 1 ? 0 : d3.randomInt(SYMBOLS.length)()];
    }

    const [c0, c1] = [scale(i0), scale(i1)];
    const [s0, s1] = [SYMBOLS[j0], SYMBOLS[j1]];

    return cm.svg("g", shapes, {
      transform: (_, i) => `translate(${i * dx0},${i * dy0})`,
      transition: (d, i) => [
        {
          transform: `translate(${i * dx1},${i * dy1})`,
          duration: 1000,
          delay: i * 20,
          ease: d3.easeElastic,
        },
      ],
      children: (d, i) => {
        const p = [d.x - d.r, d.y - d.r, d.r * 2];
        const path = () => interpolatePath(s0(...p), s1(...p));
        return [
          cm.svg("path", {
            stroke: "#000",
            d: s0(...p),
            fill: c0(d.r),
            strokeWidth: 0.5,
            transition: [
              {fill: c1(d.r), duration: 500, delay: i * 25},
              {d: path, duration: 500, delay: 500 + i * 25},
            ],
          }),
        ];
      },
    });
  }

  const app = cm.app({
    draw,
    loop: true,
    frameRate: 0.5,
    width: size,
    height: size,
    use: {transition: cm.transition},
  });

  const node = app.render();
  container.appendChild(node);
}
