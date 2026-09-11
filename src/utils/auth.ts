const SESSION_KEY = 'bpl-demo-auth';

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

export function signIn(_email: string, _password: string): boolean {
  if (!_email.trim() || !_password.trim()) return false;
  sessionStorage.setItem(SESSION_KEY, 'true');
  return true;
}

export function signOut(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
