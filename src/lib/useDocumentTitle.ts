import { useEffect } from 'react';

const BASE = 'Amber & Glow';

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE}` : `${BASE} | Hand-poured Soy Candles`;
  }, [title]);
}
