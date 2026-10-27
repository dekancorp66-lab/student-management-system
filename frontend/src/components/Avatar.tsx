import type { Gender } from '../types';

export function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}

export function Avatar({ name, gender, large }: { name: string; gender: Gender; large?: boolean }) {
  return <span className={`avatar avatar-${gender} ${large ? 'avatar-lg' : ''}`} aria-hidden="true">{initials(name)}</span>;
}
