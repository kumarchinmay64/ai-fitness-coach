const API_URL = "http://127.0.0.1:8000";

// Reliability summary of the most recent workout (written by LiveWorkoutPage), or null.
function readLastSessionReliability() {
  try {
    const raw = localStorage.getItem('ai_fitness_last_session_reliability');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function askAICoach(userQuestion, profile = null, onStatusChange = null) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [Frontend Chat] Frontend message submitted: "${userQuestion}"`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000); // 35s timeout
  const t0 = performance.now();

  try {
    if (onStatusChange) onStatusChange('Searching fitness evidence...');
    console.log(`[${new Date().toISOString()}] [Frontend Chat] HTTP request sent to ${API_URL}/chat`);

    // Update status to generating response shortly
    const statusTimer = setTimeout(() => {
      if (onStatusChange) onStatusChange('Generating evidence-grounded answer...');
    }, 600);

    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        message: userQuestion,
        profile: profile,
        session: readLastSessionReliability(),
      }),
    });

    clearTimeout(statusTimer);
    clearTimeout(timeoutId);

    const receiveTime = new Date().toISOString();
    console.log(`[${receiveTime}] [Frontend Chat] HTTP response received with status: ${response.status}`);

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const detail = errBody.detail || `Backend error: ${response.status}`;
      throw new Error(detail);
    }

    const data = await response.json();
    const durationMs = (performance.now() - t0).toFixed(1);
    console.log(`[${new Date().toISOString()}] [Frontend Chat] Final response returned to frontend (duration: ${durationMs}ms)`);

    return data.answer;
  } catch (error) {
    clearTimeout(timeoutId);
    const durationMs = (performance.now() - t0).toFixed(1);
    console.error(`[${new Date().toISOString()}] [Frontend Chat] Error after ${durationMs}ms:`, error);

    if (error.name === 'AbortError') {
      return "The request timed out while contacting the AI fitness coach. Please check your connection and try asking again.";
    }

    if (error.message && error.message.includes('evidence-supported')) {
      return error.message;
    }

    return "Sorry, I couldn't connect to the AI fitness coach right now. Please ensure the backend server is running and try again.";
  }
}