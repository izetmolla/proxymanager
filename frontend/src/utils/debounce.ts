/* eslint-disable */
export function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number,
    immediate: boolean = false
): (...args: Parameters<T>) => void {
    let timeout: number | null = null;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
        const context = this;

        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };

        const callNow = immediate && timeout === null;

        if (timeout !== null) {
            clearTimeout(timeout);
        }

        timeout = window.setTimeout(later, wait);

        if (callNow) {
            func.apply(context, args);
        }
    };
}