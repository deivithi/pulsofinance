import { useState, useEffect, useRef } from 'react';

/**
 * Hook para animar um número de 0 até o valor final.
 * Usado nos cards do dashboard para dar sensação de dados "carregando".
 * 
 * @param end - Valor final do contador
 * @param duration - Duração da animação em ms (padrão: 1200ms)
 * @param enabled - Se a animação deve executar (false = mostra valor final direto)
 */
export function useAnimatedCounter(end: number, duration = 1200, enabled = true): number {
    const [count, setCount] = useState(0);
    const previousEnd = useRef(end);
    const frameRef = useRef<number>();

    useEffect(() => {
        if (!enabled || end === 0) {
            setCount(end);
            return;
        }

        // Se o valor mudou, re-anima
        const startValue = previousEnd.current !== end ? 0 : count;
        previousEnd.current = end;

        const startTime = performance.now();

        function animate(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic para desacelerar no final
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            const currentValue = Math.round(startValue + (end - startValue) * easedProgress);
            setCount(currentValue);

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            }
        }

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [end, duration, enabled]);

    return count;
}
