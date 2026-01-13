/**
 * Authentication utilities
 * 
 * Handles password-based authentication with JWT sessions
 */

/**
 * Get current user from session
 */
export async function getCurrentUser() {
  try {
    const response = await fetch("/api/auth/me", {
      credentials: "include",
    });
    const data = await response.json();
    return data.user || null;
  } catch (error) {
    return null;
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const response = await fetch("/api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to sign in");
  }

  return data;
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to create account");
  }

  return data;
}

/**
 * Sign out
 */
export async function signOut() {
  await fetch("/api/auth/signout", {
    method: "POST",
    credentials: "include",
  });
}
