import { db } from "../config/firebase-admin";

export const ProfessorController = {
    // ดึง badge requests ทั้งหมด (สำหรับ Professor)
    async getAllRequests() {
        try {
            const snapshot = await db.collection("badge_requests").orderBy("created_at", "desc").get();
            const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Enrich each request with student profile (name, avatar)
            const enriched = await Promise.all(requests.map(async (req: any) => {
                try {
                    const userDoc = await db.collection("users").doc(req.user_id).get();
                    const profile = userDoc.data()?.profile || {};
                    return {
                        ...req,
                        student_name: profile.name || "Unknown Student",
                        student_avatar: profile.avatar_url || "",
                    };
                } catch {
                    return { ...req, student_name: "Unknown Student", student_avatar: "" };
                }
            }));

            return { status: "success", data: enriched };
        } catch (error: any) {
            return { status: "error", message: "Failed to fetch all requests", detail: error.message };
        }
    }
};
