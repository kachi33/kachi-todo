const SESSION_KEY = 'todo_session_id';

export const getSessionId = (): string | null => {
  return localStorage.getItem(SESSION_KEY);
};

export const setSessionId = (sessionId: string): void => {
  localStorage.setItem(SESSION_KEY, sessionId);
};

export const createNewSession = async (): Promise<string> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to create session');
    }

    const data = await response.json();
    setSessionId(data.session_id);
    return data.session_id;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

export const ensureSession = async (): Promise<string> => {
  let sessionId = getSessionId();

  if (!sessionId) {
    sessionId = await createNewSession();
  }

  return sessionId;
};