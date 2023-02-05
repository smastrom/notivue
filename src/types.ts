import type { Component } from 'vue';

// <Notify />

export type NotifyOption = {
	type: string;
	icon: Component | null;
	title: boolean | string;
	message: string;
	close: boolean;
	duration: number;
	ariaLive: 'polite' | 'assertive';
	ariaRole: 'alert' | 'status';
};

export type Incoming = {
	id: string;
} & NotifyOption;

export type Props = Partial<{
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
	options: Record<string, Partial<NotifyOption>>;
}>;

// push()

type NotifyContenxtRenderProps = Partial<
	Pick<NotifyOption, 'title' | 'message'> & {
		close: () => void;
		prevProps?: Record<string, any>;
		nextProps?: Record<string, any>;
	}
>;

export type PushOptions = NotifyOption & {
	type: string;
	render: {
		component: Component;
		props: ({}: NotifyContenxtRenderProps) => Record<string, any>;
	} | null;
};

export type PushFunction = {
	(options?: PushOptions): ClearFunctions;
	promise: () => {
		resolve: (options?: PushOptions) => void;
		reject: (options?: PushOptions) => void;
		clear: () => void;
		clearAll: () => void;
	};
};

export type ClearFunctions = { clear: (id: string) => void; clearAll: () => void };
