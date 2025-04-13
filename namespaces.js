import {
  path,
  randomUniform,
  scaleSequential,
  easeElastic,
  extent,
  interpolateViridis,
  interpolateInferno,
  interpolateMagma,
  interpolateCubehelixDefault,
  interpolateBrBG,
  interpolatePRGn,
  interpolatePiYG,
  interpolatePuOr,
  interpolateRdBu,
  selectAll,
  randomInt,
  range,
  cross,
  min,
  randomLcg,
} from "d3";
import {svg, app} from "charmingjs";
import {symbolSquare, symbolCircle, symbolDiamond, symbolX} from "./symbols.js";
import {transition} from "./transition.js";
import {randomNoise} from "./noise.js";

export const d3 = {
  path,
  randomUniform,
  scaleSequential,
  easeElastic,
  extent,
  interpolateViridis,
  interpolateInferno,
  interpolateMagma,
  interpolateCubehelixDefault,
  interpolateBrBG,
  interpolatePRGn,
  interpolatePiYG,
  interpolatePuOr,
  interpolateRdBu,
  selectAll,
  randomInt,
  range,
  cross,
  min,
  randomLcg,
};

export const cm = {
  svg,
  app,
  symbolSquare,
  symbolCircle,
  symbolDiamond,
  symbolX,
  transition,
  randomNoise,
};
