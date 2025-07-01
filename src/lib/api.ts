
const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function fetchFeedback() {
  const res = await fetch(`${API_URL}/feedback`);
  if (!res.ok) throw new Error('Fehler beim Laden des Feedbacks');
  const data = await res.json();
  return data.data;
}

export async function submitFeedback(feedback: any) {
  const res = await fetch(`${API_URL}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedback),
  });
  if (!res.ok) throw new Error('Fehler beim Absenden des Feedbacks');
  return await res.json();
}

export async function fetchLinks() {
  const res = await fetch(`${API_URL}/feedback-links`);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Fehler beim Laden der Links: ${errorText}`);
  }
  const data = await res.json();
  return data.data;
}

export async function createLink(link: any) {
  const res = await fetch(`${API_URL}/feedback-links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(link),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { error: errorText };
    }
    throw new Error(errorData.error || 'Fehler beim Erstellen des Links');
  }
  
  const data = await res.json();
  return data.data;
}

export async function fetchLinkById(id: string) {
  const res = await fetch(`${API_URL}/feedback-links/${id}`);
  if (!res.ok) {
    throw new Error('Link nicht gefunden');
  }
  const data = await res.json();
  return data.data;
}

export async function deleteLink(id: string) {
  const res = await fetch(`${API_URL}/feedback-links/${id}`, {
    method: 'DELETE',
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { error: errorText };
    }
    throw new Error(errorData.error || 'Fehler beim Löschen des Links');
  }
  
  return await res.json();
}
