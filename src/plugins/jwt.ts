export function getJwtToken(): Promise<void> {
  console.log('getJwtToken');
  return new Promise((resolve) => {
    const isInIframe = window.self !== window.top;

    if (!isInIframe) {
      resolve(undefined);
      return;
    }

    const eventHandler = (event: MessageEvent) => {
      console.log('event', event.data?.event);
      if (event.data?.event === 'updateToken' && typeof event.data.token === 'string') {
        localStorage.setItem('authToken', `Bearer ${event.data.token}`);
        window.removeEventListener('message', eventHandler);
        resolve();
      }
    };

    console.log('eventHandler', eventHandler);
    window.addEventListener('message', eventHandler);
    window.parent.postMessage({ event: 'getToken' }, '*');
  });
}
