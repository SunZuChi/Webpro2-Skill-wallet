import { auth } from '../lib/firebase';

const API_URL = 'http://localhost:3001/api/feedback';

export const FeedbackService = {
  async getMyRequests(token?: string) {
    const idToken = token || await auth.currentUser?.getIdToken();
    if (!idToken) throw new Error("No auth token available");

    const res = await fetch(`${API_URL}/my-requests`, {
      headers: { Authorization: `Bearer ${idToken}` }
    });
    if (!res.ok) throw new Error('Failed to fetch requests');
    return res.json();
  },

  async requestBadge(payload: {
    badge_id: string;
    badge_name: string;
    skill: string;
    level: string;
    category: string;
    evidence: string;
  }) {
    const idToken = await auth.currentUser?.getIdToken();
    if (!idToken) throw new Error("No auth token available");

    const res = await fetch(`${API_URL}/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
       const err = await res.json();
       throw new Error(err.message || 'Failed to request badge');
    }
    return res.json();
  }
};
