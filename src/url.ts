import { throttle } from './utils';

interface EventItem {
  listener: (url: string) => void;
  url: string;
  options: {
    once?: boolean;
  };
  deleted: boolean;
}

interface UrlListener {
  addListener: (
    listener: EventItem['listener'],
    options?: EventItem['options']
  ) => () => void;
}

function createUrlListener(): UrlListener {
  const events: EventItem[] = [];
  let isEventRegistered = false;

  const notifyUrlListener = throttle(() => {
    const url = window.location.href;
    for (let i = events.length - 1; i >= 0; i--) {
      const item = events[i];
      if (item.url === url) {
        continue;
      }
      if (item.deleted) {
        events.splice(i, 1);
        continue;
      }
      item.listener(url);
      if (item.options.once) {
        item.deleted = true;
        if (events[i] === item) {
          events.splice(i, 1);
        }
      } else {
        item.url = url;
      }
    }
    checkAndUnregisterEvents();
  }, 500, true);

  function registerEvents() {
    if (isEventRegistered || !events.length) {
      return;
    }
    window.addEventListener('popstate', notifyUrlListener);
    window.addEventListener('hashchange', notifyUrlListener);
    isEventRegistered = true;
  }

  function checkAndUnregisterEvents() {
    if (events.length === 0 && isEventRegistered) {
      window.removeEventListener('popstate', notifyUrlListener);
      window.removeEventListener('hashchange', notifyUrlListener);
      isEventRegistered = false;
    }
  }

  function removeEventItem(item: EventItem) {
    if (item.deleted) {
      return;
    }
    const idx = events.findIndex(v => v === item);
    if (idx > -1) {
      item.deleted = true;
      events.splice(idx, 1);
      checkAndUnregisterEvents();
    }
  }

  const urlListener: UrlListener = {
    addListener(listener: EventItem['listener'], options: EventItem['options'] = {}) {
      const item: EventItem = {
        url: window.location.href,
        options,
        listener,
        deleted: false,
      };
      events.push(item);
      registerEvents();
      return () => {
        removeEventItem(item);
      };
    },
  };

  return urlListener;
}

let _urlListener: UrlListener | null = null;


function getUrlListener(): UrlListener {
  if (!_urlListener) {
    _urlListener = createUrlListener();
  }
  return _urlListener;
}

export type {
  UrlListener,
  EventItem,
};

export {
  createUrlListener,
  getUrlListener,
};
