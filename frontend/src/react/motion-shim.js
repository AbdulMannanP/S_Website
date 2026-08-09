/**
 * motion-shim.js
 * Zero-dependency drop-in replacement for framer-motion's core JSX components.
 * Replaces motion.div/img/button with CSS-transition-powered equivalents.
 * AnimatePresence is a passthrough wrapper. Hooks (useScroll etc.) are no-ops.
 */
import React, { useRef, useEffect, useState, forwardRef } from 'react';

// Build CSS from a framer-motion style object (e.g. { opacity: 0, y: 20 })
function styleFromProps(props) {
  const s = {};
  if (props.opacity !== undefined) s.opacity = props.opacity;
  if (props.x !== undefined) s.transform = `translateX(${props.x}px)`;
  if (props.y !== undefined) s.transform = `translateY(${typeof props.y === 'string' ? props.y : props.y + 'px'})`;
  if (props.scale !== undefined) s.transform = `scale(${props.scale})`;
  return s;
}

// Merge initial → animate styles, attach transition
function makeMotionComponent(tag) {
  const Comp = forwardRef(function MotionEl(
    { initial, animate, exit, transition, layout, whileHover, whileTap, children, style, ...rest },
    ref
  ) {
    const duration = (transition && transition.duration) ? transition.duration : 0.3;
    const css = {
      transition: `all ${duration}s ease`,
      ...(initial ? styleFromProps(initial) : {}),
      ...(animate ? styleFromProps(animate) : {}),
      ...style,
    };
    return React.createElement(tag, { ...rest, ref, style: css }, children);
  });
  Comp.displayName = `motion.${tag}`;
  return Comp;
}

export const motion = {
  div: makeMotionComponent('div'),
  img: makeMotionComponent('img'),
  button: makeMotionComponent('button'),
  span: makeMotionComponent('span'),
  section: makeMotionComponent('section'),
  ul: makeMotionComponent('ul'),
  li: makeMotionComponent('li'),
};

// AnimatePresence: just render children (no exit animations)
export function AnimatePresence({ children }) {
  return React.createElement(React.Fragment, null, children);
}

// Hook stubs — return safe no-op values
export function useScroll() { return { scrollY: { get: () => 0 }, scrollYProgress: { get: () => 0 } }; }
export function useTransform(v, input, output) { return { get: () => output[0] }; }
export function useSpring(v) { return v; }
export function useMotionValue(initial) {
  const ref = useRef(initial);
  ref.current = initial;
  ref.get = () => ref.current;
  return ref;
}
export function useMotionTemplate(...args) { return { get: () => '' }; }
