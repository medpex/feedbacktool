
const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function fetchFeedback() {
  console.log('fetchFeedback: Making request to', `${API_URL}/feedback`);
  const res = await fetch(`${API_URL}/feedback`);
  console.log('fetchFeedback: Response status', res.status);
  if (!res.ok) throw new Error('Fehler beim Laden des Feedbacks');
  const data = await res.json();
  console.log('fetchFeedback: Response data', data);
  return data.data;
}

export async function submitFeedback(feedback: any) {
  console.log('submitFeedback: Making request to', `${API_URL}/feedback`, 'with data:', feedback);
  const res = await fetch(`${API_URL}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedback),
  });
  console.log('submitFeedback: Response status', res.status);
  if (!res.ok) throw new Error('Fehler beim Absenden des Feedbacks');
  return await res.json();
}

export async function fetchLinks() {
  console.log('fetchLinks: Making request to', `${API_URL}/feedback-links`);
  const res = await fetch(`${API_URL}/feedback-links`);
  console.log('fetchLinks: Response status', res.status);
  if (!res.ok) {
    console.error('fetchLinks: Error response', await res.text());
    throw new Error('Fehler beim Laden der Links');
  }
  const data = await res.json();
  console.log('fetchLinks: Response data', data);
  return data.data;
}

export async function createLink(link: any) {
  console.log('createLink: Making request to', `${API_URL}/feedback-links`, 'with data:', link);
  const res = await fetch(`${API_URL}/feedback-links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(link),
  });
  console.log('createLink: Response status', res.status);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('createLink: Error response', errorText);
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { error: errorText };
    }
    throw new Error(errorData.error || 'Fehler beim Erstellen des Links');
  }
  
  const data = await res.json();
  console.log('createLink: Response data', data);
  return data.data;
}

export async function fetchLinkById(id: string) {
  console.log('fetchLinkById: Making request to', `${API_URL}/feedback-links/${id}`);
  const res = await fetch(`${API_URL}/feedback-links/${id}`);
  console.log('fetchLinkById: Response status', res.status);
  if (!res.ok) {
    console.error('fetchLinkById: Error response', await res.text());
    throw new Error('Link nicht gefunden');
  }
  const data = await res.json();
  console.log('fetchLinkById: Response data', data);
  return data.data;
}

export async function deleteLink(id: string) {
  console.log('deleteLink: Making request to', `${API_URL}/feedback-links/${id}`);
  const res = await fetch(`${API_URL}/feedback-links/${id}`, {
    method: 'DELETE',
  });
  console.log('deleteLink: Response status', res.status);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('deleteLink: Error response', errorText);
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { error: errorText };
    }
    throw new Error(errorData.error || 'Fehler beim Löschen des Links');
  }
  
  const data = await res.json();
  console.log('deleteLink: Response data', data);
  return data;
}
