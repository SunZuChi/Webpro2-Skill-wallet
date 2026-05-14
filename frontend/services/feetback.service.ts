import { auth } from '../config/firebase';

const getFreshToken = async () => {
  await auth.authStateReady();
  if (auth.currentUser) {
    return await auth.currentUser.getIdToken();
  }
  return localStorage.getItem("token");
};

export const FeetbackService = {
  /**
   * ส่งข้อมูลการประเมิน Feedback ไปยังหลังบ้าน
   * @param requestId ID ของ badge_requests
   * @param status สถานะผลการประเมิน: 'approved' | 'revisions' | 'rejected'
   * @param comment ความเห็นเสนอแนะของอาจารย์
   * @param criteriaStates สถานะเกณฑ์ย่อยที่ติ๊กผ่านหรือไม่ผ่าน เช่น { c_0: true, c_1: false }
   */
  async submitFeedback(
    requestId: string,
    status: 'approved' | 'revisions' | 'rejected',
    comment: string,
    criteriaStates: Record<string, boolean>
  ) {
    try {
      const token = await getFreshToken();
      if (!token) throw new Error("No token found");

      const response = await fetch("http://localhost:3001/api/feetback", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          request_id: requestId,
          status: status,
          comment: comment,
          criteria_states: criteriaStates
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      return { status: "error", message: (error as any).message || "Failed to submit feedback" };
    }
  }
};
