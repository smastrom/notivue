import type { VNode, Ref, Component, Raw } from 'vue';
import { Status } from './constants';

export type PluginOptions = {
	name?: string;
	keys?: string[];
};

export type ComponentProps = {
	method: 'unshift' | 'push';
	limit: number;
	pauseOnHover: boolean;
	placement:
		| 'top-left'
		| 'top-center'
		| 'top-right'
		| 'bottom-left'
		| 'bottom-center'
		| 'bottom-right';
	maxWidth: number | null;
	key: string;
	margin: { x: number; y: number };
	transitionName: string;
	options: Record<string, Partial<ComponentOptions>>;
};

export type ComponentOptions = {
	type: keyof typeof Status;
	icon: Component | false;
	title: boolean | string;
	message: boolean | string;
	close: boolean;
	duration: number;
	ariaLive: 'polite' | 'assertive';
	ariaRole: 'alert' | 'status';
};

type InternalOptions = {
	id: string;
	type: keyof typeof Status | string;
};

export type Notification = InternalOptions &
	ComponentOptions & {
		timeoutId: number | undefined;
		id: string;
		createdAt: number;
		stoppedAt: number;
		elapsed: number;
		clear: () => void;
		userProps: Record<string, any>;
		component?: Component;
		renderFn?: () => VNode;
	};

type MaybeRender<T> = {
	render?: {
		component?: Raw<Component>;
		props?: (props: T) => Record<string, any>;
	};
};

export type UserOptions<T = NotifyProps> = Partial<ComponentOptions> & MaybeRender<T>;

export type UserOptionsWithInternals<T = NotifyProps> = ComponentOptions &
	MaybeRender<T> &
	InternalOptions;

export type Receiver = {
	notifications: Notification[];
	incoming: Ref<UserOptions & InternalOptions>;
	push: () => PushFn;
};

type NotifyProps = {
	notifyProps: {
		type: InternalOptions['type'];
		close: () => void;
		title?: ComponentOptions['title'];
		message?: ComponentOptions['message'];
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
