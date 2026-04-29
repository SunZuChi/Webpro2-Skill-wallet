const API_URL = 'http://localhost:3001/api/catalog';

export const BadgeService = {
  async getCatalog(category?: string) {
    const url = category && category !== 'all' ? `${API_URL}?category=${encodeURIComponent(category)}` : API_URL;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch badge catalog');
    return res.json();
  }
};
