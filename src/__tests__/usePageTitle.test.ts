import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePageTitle } from '../app/hooks/usePageTitle';

describe('usePageTitle', () => {
  it('define o título da página com o sufixo GANJJ', () => {
    renderHook(() => usePageTitle('Lookbook'));
    expect(document.title).toBe('Lookbook | GANJJ');
  });

  it('usa apenas GANJJ quando o título é vazio', () => {
    renderHook(() => usePageTitle(''));
    expect(document.title).toBe('GANJJ');
  });

  it('atualiza o título quando a prop muda', () => {
    const { rerender } = renderHook(({ title }) => usePageTitle(title), {
      initialProps: { title: 'Sale' },
    });
    expect(document.title).toBe('Sale | GANJJ');

    rerender({ title: 'Contato' });
    expect(document.title).toBe('Contato | GANJJ');
  });
});
