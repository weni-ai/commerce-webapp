export function getJwtToken() {
  return new Promise((resolve) => {
    const isInIframe = window.self !== window.top;

    if (!isInIframe) resolve(undefined);

    const eventHandler = (event: any) => {
      console.log('event', event.data.event);
      if (event.data.event === 'updateToken') {
        localStorage.setItem('authToken', `Bearer ${event.data.token}`);
        window.removeEventListener('message', eventHandler);
        return resolve(undefined);
      }
    };
    window.addEventListener('message', eventHandler);
    window.parent.postMessage({ event: 'getToken' }, '*');
  });
}
