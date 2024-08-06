export function getCSRFToken(): string | null {
  let csrfToken = null;
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
      if (cookie.startsWith('csrftoken=')) {
        csrfToken = cookie.split('=')[1];
        break;
      }
    }
  }
  console.log('CSRF Token:', csrfToken); 
  return csrfToken;
}