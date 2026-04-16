'use client';

import { useEffect, useRef, useCallback } from 'react';

export function ShineEffect() {
  const containerRef = useRef<HTMLDivElement>(null);

  const createShine = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // ランダム角度
    const angle = Math.random() * 360;

    const el = document.createElement('div');
    el.style.cssText = [
      'position:fixed',
      'top:-200vh',
      'left:-200vw',
      'width:500vw',
      'height:500vh',
      `background:linear-gradient(${angle}deg,transparent 44%,rgba(255,255,255,0.7) 50%,transparent 56%)`,
      'pointer-events:none',
      'z-index:0',
      'will-change:transform',
    ].join(';');

    // 角度に基づいた移動ベクトル
    const rad = (angle * Math.PI) / 180;
    const moveX = Math.cos(rad) * 300;
    const moveY = Math.sin(rad) * 300;

    el.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
    container.appendChild(el);

    // 次フレームでアニメーション開始
    requestAnimationFrame(() => {
      el.style.transition = 'transform 2.5s linear, opacity 0.4s';
      el.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    setTimeout(() => { el.style.opacity = '0'; }, 2200);
    setTimeout(() => { el.remove(); }, 2800);
  }, []);

  useEffect(() => {
    createShine();
    const id = setInterval(createShine, 6000);
    return () => clearInterval(id);
  }, [createShine]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}
    />
  );
}
