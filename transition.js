import {d3} from "./namespaces.js";

export function transition(node, keyframes) {
  const selection = d3.selectAll([node]);
  let transition = selection;

  for (const {duration, ease, delay, ...attr} of keyframes) {
    transition = transition.transition();
    transition
      .duration(duration)
      .call((t) => ease && t.ease(ease))
      .call((t) => delay && t.delay(delay));
    for (const key in attr) {
      const value = attr[key];
      if (key.startsWith("style")) {
        const style = key.slice(5).toLowerCase();
        transition.style(style, value);
      } else {
        if (typeof value === "function") transition.attrTween(key, value);
        else transition.attr(key, value);
      }
    }
  }

  return node;
}
