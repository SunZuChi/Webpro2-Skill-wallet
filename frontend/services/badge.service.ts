import { auth } from '../config/firebase';

const getFreshToken = async () => {
  await auth.authStateReady();
  if (auth.currentUser) {
    return await auth.currentUser.getIdToken(); // ใช้ cached token (valid 1hr), ไม่ force refresh ทุกครั้ง
  }
  return localStorage.getItem("token");
};

export const BadgeService = {
  // ดึงข้อมูล Badge ทั้งหมดเพื่อนำมาแสดงใน Modal
  async getAllBadges() {
    try {
      const token = await getFreshToken();
      if (!token) throw new Error("No token found");

      const response = await fetch("http://localhost:3001/api/badges", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch badges:", error);
      return { status: "error", data: [] };
    }
  },

  // Upload ไฟล์ผ่าน Backend (ไม่มีปัญหา CORS)
  async uploadEvidence(file: File) {
    try {
      const token = await getFreshToken();
      if (!token) throw new Error("No token found");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:3001/api/badge-requests/upload", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });

      const responseData = await response.json();
      if (!response.ok) {
        console.error("Backend upload error:", response.status, responseData);
      }
      return responseData;
    } catch (error) {
      console.error("Failed to upload file:", error);
      return { status: "error" };
    }
  },

  // ส่งคำขอสร้าง Badge ใหม่ไปยัง Collection badge_requests
  async createRequest(requestData: any) {
    try {
      const token = await getFreshToken();
      if (!token) throw new Error("No token found");

      const response = await fetch("http://localhost:3001/api/badge-requests", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      });
      return await response.json();
    } catch (error) {
      console.error("Failed to create badge request:", error);
      return { status: "error" };
    }
  },

  async getMyRequests() {
    try {
      const token = await getFreshToken();
      if (!token) throw new Error("No token found");

      const response = await fetch("http://localhost:3001/api/badge-requests/my-requests", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      return { status: "error", data: [] };
    }
  }
};
