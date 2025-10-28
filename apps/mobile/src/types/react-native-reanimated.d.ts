import type { GestureEvent, HandlerStateChangeEvent } from 'react-native-gesture-handler';

declare module 'react-native-reanimated' {
  export function useAnimatedGestureHandler<TEvent extends GestureEvent<any, any> | HandlerStateChangeEvent<any>, TContext extends Record<string, unknown>>(
    _handlers: {
      onStart?: (_event: TEvent, _context: TContext) => void;
      onActive?: (_event: TEvent, _context: TContext) => void;
      onEnd?: (_event: TEvent, _context: TContext) => void;
      onFinish?: (_event: TEvent, _context: TContext, _cancelled: boolean) => void;
    },
    _deps?: ReadonlyArray<unknown>
  ): (_event: TEvent) => void;
}
