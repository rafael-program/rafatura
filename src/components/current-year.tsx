// src/components/current-year.tsx
async function getCurrentYear() {
  'use cache';
  return new Date().getFullYear();
}

export async function CurrentYear() {
  const year = await getCurrentYear();
  return <>{year}</>;
}