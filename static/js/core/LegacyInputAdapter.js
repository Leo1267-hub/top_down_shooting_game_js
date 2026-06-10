import { InputManager } from "./InputManager.js";

const inputManager = new InputManager(window);
const originalAddEventListener = window.addEventListener.bind(window);
const originalRemoveEventListener = window.removeEventListener.bind(window);
const wrappedListeners = new Map();

function listenerKey(type, listener) {
    return `${type}:${listener}`;
}

function shouldBridge(type, listener) {
    return (
        (type === "keydown" || type === "keyup") &&
        typeof listener === "function"
    );
}

window.addEventListener = function addEventListenerWithInputBridge(type, listener, options) {
    if (!shouldBridge(type, listener)) {
        return originalAddEventListener(type, listener, options);
    }

    const key = listenerKey(type, listener);

    if (wrappedListeners.has(key)) {
        return originalAddEventListener(type, wrappedListeners.get(key), options);
    }

    const wrappedListener = function bridgedInputListener(event) {
        if (type === "keydown") {
            inputManager.handleKeyDown(event);
        } else {
            inputManager.handleKeyUp(event);
        }

        return listener.call(this, event);
    };

    wrappedListeners.set(key, wrappedListener);
    return originalAddEventListener(type, wrappedListener, options);
};

window.removeEventListener = function removeEventListenerWithInputBridge(type, listener, options) {
    if (!shouldBridge(type, listener)) {
        return originalRemoveEventListener(type, listener, options);
    }

    const key = listenerKey(type, listener);
    const wrappedListener = wrappedListeners.get(key);

    if (wrappedListener) {
        wrappedListeners.delete(key);
        return originalRemoveEventListener(type, wrappedListener, options);
    }

    return originalRemoveEventListener(type, listener, options);
};

window.gameInput = inputManager;

export { inputManager };
