import { auth } from '../lib/firebase';

const API_URL = 'http://localhost:3001/api/profile';

export const ProfileService = {
  async getMyProfile(token?: string) {
    const idToken = token || await auth.currentUser?.getIdToken();
    if (!idToken) throw new Error("No auth token available");
    
    const res = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${idToken}` }
    });
    
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  }
};
