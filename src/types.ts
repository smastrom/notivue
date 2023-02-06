import type { Ref, Component } from 'vue';

export type PluginOptions = {
	name?: string;
	keys?: string[];
};

export type Receiver = {
	container: Ref<ContainerItem[]>;
	incoming: Ref<IncomingItem>;
	push: () => PushFunction;
};

type Render = {
	component: Component;
	props: ({}: NotifyContenxtRenderProps) => Record<string, any>;
} | null;

export type IncomingItem = {
	id: string;
	render: Render;
} & TypeOption;

export type TypeOption = {
	type: 'success' | 'error' | 'promise' | 'promise-resolve' | 'promise-reject';
	icon: Component | null;
	title: boolean | string;
	message: string;
	close: boolean;
	duration: number;
	ariaLive: 'polite' | 'assertive';
	ariaRole: 'alert' | 'status';
};

export type ContainerItem = IncomingItem & {
	timeoutId: number | undefined;
	createdAt: number;
	stoppedAt: number;
	elapsed: number;
};

// <Notify />

export type Props = {
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
	options: Record<string, Partial<TypeOption>>;
};

// push()

type NotifyContenxtRenderProps = Partial<
	Pick<TypeOption, 'title' | 'message'> & {
		close: () => void;
		prevProps?: Record<string, any>;
		nextProps?: Record<string, any>;
	}
>;

export type PushFunction = {
	(options?: IncomingItem): ClearFunctions;
	promise: () => {
		resolve: (options?: IncomingItem) => void;
		reject: (options?: IncomingItem) => void;
		clear: () => void;
		clearAll: () => void;
	};
};

export type ClearFunctions = { clear: (id: string) => void; clearAll: () => void };
