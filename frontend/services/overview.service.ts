import { auth } from '../config/firebase';

const API_BASE = 'http://localhost:3001';

const getFreshToken = async (): Promise<string | null> => {
  await auth.authStateReady();
  if (auth.currentUser) {
    return await auth.currentUser.getIdToken();
  }
  return localStorage.getItem('token');
};

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  profile: {
    name: string;
    bio?: string;
    avatar_url?: string;
    location?: string;
  };
}

export interface BadgeRequest {
  id: string;
  badge_id: string;
  badge_name: string;
  category: string;
  description: string;
  evidence_link: string;
  status: 'pending' | 'approved' | 'revision' | 'rejected';
  verifier_id: string | null;
  comment: string;
  created_at: string;
  updated_at: string;
  verified_at: string | null;
  total_score: number;
  max_score: number;
  result: any[];
}

export interface OverviewStats {
  totalVerified: number;
  totalPending: number;
  totalRevision: number;
  recentRequests: BadgeRequest[];
  approvedRequests: BadgeRequest[];
}

export const OverviewService = {
  async getMyProfile(): Promise<UserProfile | null> {
    try {
      const token = await getFreshToken();
      if (!token) return null;

      const response = await fetch(`${API_BASE}/api/auth/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.status === 'success') return data.data as UserProfile;
      return null;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      return null;
    }
  },

  async getMyRequests(): Promise<BadgeRequest[]> {
    try {
      const token = await getFreshToken();
      if (!token) return [];

      const response = await fetch(`${API_BASE}/api/badge-requests/my-requests`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.status === 'success') {
        return data.data as BadgeRequest[];
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      return [];
    }
  },

  computeStats(requests: BadgeRequest[]): OverviewStats {
    const approved = requests.filter((r) => r.status === 'approved');
    const pending = requests.filter((r) => r.status === 'pending');
    const revision = requests.filter((r) => r.status === 'revision');

    return {
      totalVerified: approved.length,
      totalPending: pending.length,
      totalRevision: revision.length,
      recentRequests: requests.slice(0, 5),
      approvedRequests: approved,
    };
  },

  // คำนวณ Skill Matrix จาก approved badges ตาม category
  computeSkillMatrix(requests: BadgeRequest[]) {
    const categories: Record<string, { total: number; count: number }> = {
      'Software / Web': { total: 0, count: 0 },
      'Data / AI': { total: 0, count: 0 },
      'Game / Graphics': { total: 0, count: 0 },
      'Cyber / Network': { total: 0, count: 0 },
    };

    const approved = requests.filter((r) => r.status === 'approved');

    for (const req of approved) {
      const cat = req.category;
      if (categories[cat]) {
        const score = req.max_score > 0 ? req.total_score / req.max_score : 0.5;
        categories[cat].total += score;
        categories[cat].count += 1;
      }
    }

    return Object.entries(categories).map(([name, { total, count }]) => ({
      name,
      score: count > 0 ? total / count : 0,
    }));
  },
};
