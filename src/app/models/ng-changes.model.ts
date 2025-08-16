type MarkedClassMethods<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? // @ts-expect-error Check if method is prototype method
      K extends keyof T & keyof T['prototype']
      ? never
      : K
    : K;
};

type ExcludeClassMethods<T> = Pick<T, MarkedClassMethods<T>[keyof T]>;

/**
 * A fully-typed version of Angular's SimpleChanges.
 *
 * Courtesy of Netanel Basal
 * https://medium.com/netanelbasal/create-a-typed-version-of-simplechanges-in-angular-451f86593003
 *
 * @example
 * export class MyComponent implements OnChanges {
 *   prop1: string;
 *   prop2: number;
 *
 *   ngOnChanges(changes: NgChanges<MyComponent>) {
 *     if (changes.prop1) {
 *       ...
 *     } else if (changes.prop2) {
 *       ...
 *     }
 *   }
 * }
 */
export type NgChanges<Component, Props = ExcludeClassMethods<Component>> = Partial<{
  [Key in keyof Props]: {
    previousValue: Props[Key];
    currentValue: Props[Key];
    firstChange: boolean;
    isFirstChange(): boolean;
  };
}>;
