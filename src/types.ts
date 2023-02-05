import type { Component } from 'vue';

// <Notify />

export type NotifyOption = {
	icon: Component;
	title: boolean | string;
	message: string;
	close: boolean;
	duration: number;
	ariaLive: 'polite' | 'assertive';
	ariaRole: 'alert' | 'status';
};

export type NotifyProps = Partial<{
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
		type: string;
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
	};
};
