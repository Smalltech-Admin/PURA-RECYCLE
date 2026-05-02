'use client';

import { useEffect, useRef, useCallback } from 'react';

const TRAVEL_MS = 4000; // ページ1と同じ流れスピード
const MIN_INTERVAL = 800;
const MAX_INTERVAL = 1800;

export function ShineEffect() {
  const containerRef = useRef<HTMLDivElement>(null);

  const createShine = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const angle = Math.random() * 360;

    // ラインの実移動速度を一定にするため、グラデーション方向に沿って移動
    const rad = (angle * Math.PI) / 180;
    const dx = Math.sin(rad);
    const dy = -Math.cos(rad);
    const dist = 50;
    const startX = -dx * dist;
    const startY = -dy * dist;
    const endX = dx * dist;
    const endY = dy * dist;

    const el = document.createElement('div');
    el.style.cssText = [
      'position:absolute',
      'top:-100%',
      'left:-100%',
      'width:400%',
      'height:400%',
      `background:linear-gradient(${angle}deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 48%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 52%, rgba(255,255,255,0) 100%)`,
      'pointer-events:none',
      'z-index:0',
      'will-change:transform',
      `transform:translate(${startX}%,${startY}%)`,
    ].join(';');

    container.appendChild(el);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `transform ${TRAVEL_MS}ms linear, opacity 0.4s`;
        el.style.transform = `translate(${endX}%,${endY}%)`;
      });
    });

    setTimeout(() => { el.style.opacity = '0'; }, TRAVEL_MS - 300);
    setTimeout(() => { el.remove(); }, TRAVEL_MS + 300);
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    function scheduleNext() {
      const delay = MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL);
      timeoutId = setTimeout(() => {
        createShine();
        scheduleNext();
      }, delay);
    }

    createShine();
    const t1 = setTimeout(() => createShine(), 600);
    const t2 = setTimeout(() => createShine(), 1200);
    scheduleNext();

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(timeoutId);
    };
  }, [createShine]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}
    />
  );
}
