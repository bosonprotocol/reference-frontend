import ReactDOM from "react-dom";

export function batch(callback) {
    ReactDOM.unstable_batchedUpdates(callback);
}

export function delay(callback, delayMs) {
    let handle = setTimeout(callback, delayMs);
    return () => {
        if (handle) clearTimeout(handle);
        handle = null;
    };
}

function objGet(obj, path) {
    let v = obj;
    for (const part of path) {
        v = v ? v[part] : undefined;
    }
    return v;
}

function objSet(obj, path, value) {
    const parent = objGet(obj, path.slice(0, -1));
    if (parent) {
        parent[path[path.length - 1]] = value;
    } else {
        console.warn(`[store] cant set ${path}: missing parent`);
    }
    return obj;
}

export default class Store {
    constructor(defaultState = {}) {
        this.defaultState = JSON.stringify(defaultState);
        this.state = defaultState;
        this.subscribers = { _: [] };
        this.pendingNotifyPaths = {};
        this.pendingNotifyDelay = 50;
        this.pendingNotifyHandle = null;
        this.dispatchNotify = this.dispatchNotify.bind(this);
    }
    reset() {
        this.state = JSON.parse(this.defaultState);
        this.notifyChildren([]);
    }
    notifyPath(path) {
        let pendingNotifyNode = this.pendingNotifyPaths;
        for (let i = 0; i < path.length; i++) {
            pendingNotifyNode = pendingNotifyNode[path[i]] =
                pendingNotifyNode[path[i]] || {};
        }
        if (this.pendingNotifyHandle) this.pendingNotifyHandle();
        this.pendingNotifyHandle = delay(
            this.dispatchNotify,
            this.pendingNotifyDelay
        );
    }
    dispatchNotify() {
        const pendingNotifyPaths = this.pendingNotifyPaths;
        this.pendingNotifyPaths = {};
        this.pendingNotifyHandle = null;
        // console.log('DISPATCH NOTIFY', pendingNotifyPaths);
        batch(() => {
            this.dispatchNotifyNode(pendingNotifyPaths, []);
        });
    }
    dispatchNotifyNode(node, path) {
        const subscribers = objGet(this.subscribers, path);
        const newValue = objGet(this.state, path);
        // console.log('STORE NOTIFYING', path, subscribers, newValue);
        if (subscribers) subscribers._.forEach((fn) => fn(newValue));
        for (let key of Object.keys(node)) {
            this.dispatchNotifyNode(node[key], path.concat([key]));
        }
    }
    notifyChildren(path) {
        const subscribers = objGet(this.subscribers, path);
        if (!subscribers) return;
        const state = objGet(this.state, path);
        for (let key of Object.keys(subscribers)) {
            if (key === "_") {
                subscribers._.forEach((fn) => fn(state));
            } else {
                this.notifyChildren(path.concat([key]));
            }
        }
    }
    get(path) {
        return objGet(this.state, path);
    }
    set(path, value) {
        this.state = objSet(this.state, path, value);
        this.notifyPath(path);
    }
    subscribe(path, fn) {
        let s = this.subscribers;
        for (const part of path) {
            if (!s[part]) {
                s[part] = { _: [] };
            }
            s = s[part];
        }
        s._.push(fn);
        return () => {
            const index = s._.indexOf(fn);
            if (index !== -1) s._.splice(index, 1);
        };
    }
}
