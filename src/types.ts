import type { VNode, Ref, Component, Raw } from 'vue';
import { NType } from './constants';

export type PluginOptions = {
   name?: string;
   additionalReceivers?: string[];
};

export type Position =
   | 'top-left'
   | 'top-center'
   | 'top-right'
   | 'bottom-left'
   | 'bottom-center'
   | 'bottom-right';

export type ReceiverProps = {
   disabled: boolean;
   method: 'unshift' | 'push';
   limit: number;
   pauseOnHover: boolean;
   position: Position;
   maxWidth: number;
   id: string;
   rootMargin: string;
   transitionName: string;
   transitionGroupName: string;
   options: Partial<Record<`${NType}`, Partial<ReceiverOptions>>>;
   theme: Record<`--${string}`, string>;
};

export type ReceiverOptions = {
   icon: Component | false;
   title: boolean | string;
   message: boolean | string;
   close: boolean;
   duration: number;
   ariaLive: 'polite' | 'assertive';
   ariaRole: 'alert' | 'status';
};

export type InternalPushOptions = {
   id: string;
   type: `${NType}`;
};

export type UserOptions<T = NotifyProps> = Partial<ReceiverOptions> & MaybeRender<T>;

export type MergedOptions<T = NotifyProps> = ReceiverOptions & InternalPushOptions & MaybeRender<T>;

export type Notification = InternalPushOptions &
   ReceiverOptions & {
      timeoutId: number | undefined;
      id: string;
      createdAt: number;
      stoppedAt: number;
      elapsed: number;
      clear: () => void;
      props: Record<string, any>;
      component?: Component;
      h?: () => VNode;
   };

type MaybeRender<T> = {
   render?: {
      component?: Raw<Component>;
      props?: (props: T) => Record<string, any>;
   };
};

export type Receiver = {
   items: Notification[];
   incoming: Ref<UserOptions & InternalPushOptions>;
   push: () => PushFn;
};

type NotifyProps = {
   notifyProps: {
      type: InternalPushOptions['type'];
      close: () => void;
      title?: ReceiverOptions['title'];
      message?: ReceiverOptions['message'];
   };
};

type WithPrevProps = Partial<
   UserOptions<NotifyProps & { prevProps?: Record<string, any> | undefined }>
>;

export type PushFn = {
   (options: Partial<UserOptions>): ClearFns;
   promise: (options: Partial<UserOptions>) => {
      resolve: (options: WithPrevProps) => void;
      reject: (options: WithPrevProps) => void;
      clear: ClearFns['clear'];
      clearAll: ClearFns['clearAll'];
   };
   error: (options: Partial<UserOptions>) => ClearFns;
   success: (options: Partial<UserOptions>) => ClearFns;
   warning: (options: Partial<UserOptions>) => ClearFns;
   info: (options: Partial<UserOptions>) => ClearFns;
   clearAll: ClearFns['clearAll'];
};

export type ClearFns = { clear: () => void; clearAll: () => void };
