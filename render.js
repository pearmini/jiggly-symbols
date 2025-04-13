import {d3, cm} from "./namespaces.js";
import {interpolate as interpolatePath} from "flubber";

const COLORS = [
  d3.interpolateViridis,
  d3.interpolateInferno,
  d3.interpolateMagma,
  d3.interpolateCubehelixDefault,
  d3.interpolateBrBG,
  d3.interpolatePRGn,
  d3.interpolatePiYG,
  d3.interpolatePuOr,
  d3.interpolateRdBu,
];

const SYMBOLS = [cm.symbolX, cm.symbolCircle, cm.symbolDiamond, cm.symbolSquare];

function fillSquares(rows, randomInt = d3.randomInt) {
  const cells = [{x: 0, y: 0, x1: rows, y1: rows}];

  fill(0);

  function fill(i) {
    const cell = cells[i];
    const point = pick(cell);
    const subcells = divide(cell, point).filter(defined);
    cells.splice(i, 1, ...subcells);
    for (let j = subcells.length - 1; j >= 0; j--) {
      if (!square(subcells[j])) fill(i + j);
    }
  }

  function divide(cell, point) {
    const {x, y, x1, y1} = cell;
    const [px, py] = point;
    return [
      {x, y, x1: px, y1: py},
      {x: px, y, x1: x1, y1: py},
      {x: px, y: py, x1, y1},
      {x: x, y: py, x1: px, y1: y1},
    ];
  }

  function defined({x, y, x1, y1}) {
    return x1 - x >= 1 && y1 - y >= 1;
  }

  // Don't just generate one big blank square!!!
  function square({x, y, x1, y1}) {
    return x1 - x === y1 - y && x1 - x !== rows;
  }

  function pick(cell) {
    const {x, y, x1, y1} = cell;
    const points = d3
      .cross(d3.range(x, x1 + 1), d3.range(y, y1 + 1))
      .filter((point) => divide(cell, point).some(square));
    return points[randomInt(points.length)()];
  }

  return cells;
}

function createSymbols(cells, {randomInt}) {
  const randomSeed = randomInt(100000);
  const randomColorIndex = randomInt(COLORS.length);
  const randomSymbolIndex = randomInt(SYMBOLS.length);
  const data = cells
    .map((d) => {
      const symbolIndex = randomSymbolIndex();
      return {
        x: (d.x + d.x1) / 2,
        y: (d.y + d.y1) / 2,
        fromX: 0,
        fromY: 0,
        toX: 0,
        toY: 0,
        fromColorIndex: 0,
        toColorIndex: 0,
        fromSymbolIndex: symbolIndex,
        toSymbolIndex: symbolIndex,
        shapes: createShape(0, 0, (d.x1 - d.x) / 2 - 10),
      };
    })
    .sort((a, b) => a.shapes.length - b.shapes.length);

  function createShape(x, y, r) {
    const shapes = [];
    const count = Math.sqrt(r * 0.8);
    const step = r / count;
    for (let i = 0; i < count; i++) shapes.push({x, y, r: step * i});
    return shapes.reverse();
  }

  return {
    tick({frameCount}) {
      const randomX = cm.randomNoise(-25, 25, {seed: randomSeed()});
      const randomY = cm.randomNoise(-25, 25, {seed: randomSeed()});
      const colorIndex = randomColorIndex();
      for (const datum of data) {
        if (frameCount !== 0) {
          [datum.fromX, datum.toX] = [datum.toX, randomX(datum.x * 0.005, datum.y * 0.005)];
          [datum.fromY, datum.toY] = [datum.toY, randomY(datum.x * 0.005, datum.y * 0.005)];
          [datum.fromColorIndex, datum.toColorIndex] = [datum.toColorIndex, colorIndex];
          [datum.fromSymbolIndex, datum.toSymbolIndex] = [datum.toSymbolIndex, randomSymbolIndex()];
        }
      }
    },
    data() {
      return data;
    },
  };
}

function symbol({shapes, fromX, fromY, toX, toY, fromColorIndex, toColorIndex, fromSymbolIndex, toSymbolIndex}) {
  const R = d3.extent(shapes.map((d) => d.r)).reverse();
  const color = (i) => d3.scaleSequential(R, COLORS[i]);
  return cm.svg("g", shapes, {
    transform: (_, i) => `translate(${i * fromX}, ${i * fromY})`,
    transition: (_, i) => [
      {
        transform: `translate(${i * toX},${i * toY})`,
        duration: 1000,
        delay: i * 20,
        ease: d3.easeElastic,
      },
    ],
    children: (d) => {
      const p = [d.x - d.r, d.y - d.r, d.r * 2];
      const path = () => interpolatePath(SYMBOLS[fromSymbolIndex](...p), SYMBOLS[toSymbolIndex](...p));
      return [
        cm.svg("path", {
          d: path(),
          fill: color(fromColorIndex)(d.r),
          stroke: "#000",
          transition: (_, i) => [
            {
              fill: color(toColorIndex)(d.r),
              duration: 500,
              delay: i * 20,
            },
            {d: path, duration: 500, delay: 500 + i * 20},
          ],
        }),
      ];
    },
  });
}

export function render({seed} = {}) {
  const randomInt = seed === undefined ? d3.randomInt : d3.randomInt.source(d3.randomLcg(seed));
  const randomUniform = seed === undefined ? d3.randomUniform : d3.randomUniform.source(d3.randomLcg(seed));
  const width = window.innerWidth;
  const height = window.innerHeight;
  const size = 800;
  const padding = 10;
  const rows = 8;
  const unit = (size - padding * 2) / rows;
  const pos = (x) => padding + x * unit;
  const cells = fillSquares(rows, randomInt).map((d) => ({x: pos(d.x), y: pos(d.y), x1: pos(d.x1), y1: pos(d.y1)}));
  const symbols = createSymbols(cells, {randomInt, randomUniform});
  const data = symbols.data();

  function draw({frameCount}) {
    symbols.tick({frameCount});
    return [
      cm.svg("g", {
        transform: `translate(${(width - size) / 2}, ${(height - size) / 2})`,
        children: [
          cm.svg("g", data, {
            transform: (d) => `translate(${d.x}, ${d.y})`,
            children: (d) => [symbol(d)],
          }),
        ],
      }),
    ];
  }

  const app = cm.app({
    loop: true,
    frameRate: 0.5,
    width,
    height,
    use: {transition: cm.transition},
    draw,
  });

  return app.render();
}
