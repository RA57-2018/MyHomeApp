export const apiUrl = () => {
  const r = new RegExp('^(?:[a-z]+:)?//', 'i');

  if (r.test(window.REAL_ESTATE_APP_CORE_URL)) {
    return window.REAL_ESTATE_APP_CORE_URL;
  } else {
    return window.location.origin + window.REAL_ESTATE_APP_CORE_URL;
  }
};
