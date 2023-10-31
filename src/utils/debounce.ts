/**
 *  Debounces a function execution by a delay.
 */
export function debounce(func: Function, timeout = 300) {
  let timer: NodeJS.Timeout;

  return (...args: any[]) => {
    //@ts-ignore
    const ctx = this;

    clearTimeout(timer);

    timer = setTimeout(() => {
      func.apply(ctx, args);
    }, timeout);
  };
}
