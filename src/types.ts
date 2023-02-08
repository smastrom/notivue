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
		| 'top-right'
		| 'top-center'
		| 'center'
		| 'bottom-left'
		| 'bottom-center'
		| 'bottom-right';
	position: 'fixed' | 'relative';
	key: string;
	customClass: string;
	noDefaultClass: boolean;
	transitionName: string;
	options: Record<string, Partial<ComponentOptions>>;
};

export type ComponentOptions = {
	type: keyof typeof Status | string;
	icon: Component | false;
	title: boolean | string;
	message: boolean | string;
	close: boolean;
	duration: number;
	ariaLive: 'polite' | 'assertive';
	ariaRole: 'alert' | 'status';
};

export type ReceiverStore = {
	notifications: Ref<Notification[]>;
	incoming: Ref<UserOptions & { id: string }>;
	push: () => PushFn;
};

export type Notification = ComponentOptions & {
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

type NotifyProps = {
	notifyProps: {
		type: ComponentOptions['type'];
		close: () => void;
		title?: ComponentOptions['title'];
		message?: ComponentOptions['message'];
	};
};

type MaybeRender<T> = {
	render?: {
		component?: Raw<Component>;
		props?: (props: T) => Record<string, any>;
	};
};

export type UserOptions<T = NotifyProps> = Partial<ComponentOptions> & MaybeRender<T>;
export type UserOptionsWithDefaults<T = NotifyProps> = ComponentOptions &
	MaybeRender<T> & { id: string };

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
	clearAll: ClearFns['clearAll'];
};

export type ClearFns = { clear: () => void; clearAll: () => void };
