import { Elysia } from 'elysia';
import { auth, db } from '../config/firebase-admin';

export type UserContext = {
    uid: string;
    role: 'user' | 'verifier';
    profile?: any;
    auth?: any;
    [key: string]: any;
};

// Middleware สำหรับตรวจสอบ Token และดึงข้อมูล User
export const authMiddleware = new Elysia({ name: 'auth-middleware' })
  .derive({ as: 'global' }, async ({ request, set }): Promise<{ user: UserContext }> => {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      set.status = 401;
      throw new Error("Unauthorized: No token provided");
    }

    const token = authHeader.split(' ')[1];
    
    try {
      // // ====== MOCK MODE ======  test-u<n> = user, test-v<n> = verifier
      // if (token.startsWith("test-")) {
      //   const mockId = token.replace("test-", "");
        
      //   let role: "user" | "verifier";
      //   if (mockId.startsWith("u")) {
      //     role = "user";
      //   } else if (mockId.startsWith("v")) {
      //     role = "verifier";
      //   } else {
      //     set.status = 401;
      //     throw new Error("Invalid mock token format. Use test-u<n> or test-v<n>");
      //   }

      //   const userDoc = await db.collection("users").doc(mockId).get();
      //   const data = userDoc.exists ? userDoc.data() : { auth: { user_id: mockId, role } };
      //   return {
      //     user: {
      //       uid: mockId,
      //       role,
      //       ...data
      //     } as UserContext
      //   };
      // }

      // ====== REAL MODE ======
      const decodedToken = await auth.verifyIdToken(token);
      const user_id = decodedToken.uid;

      const userDoc = await db.collection("users").doc(user_id).get();
      if (!userDoc.exists) {
        set.status = 401;
        throw new Error("Unauthorized: User not found in database. Please register first.");
      }

      const userData = userDoc.data() || {};
      return {
        user: {
          uid: user_id,
          role: userData?.auth?.role as 'user' | 'verifier',
          ...userData
        } as UserContext
      };
    } catch (error) {
      if ((error as Error).message.startsWith("Unauthorized") || (error as Error).message.startsWith("Invalid") || (error as Error).message.startsWith("Forbidden")) {
        throw error;
      }
      set.status = 401;
      throw new Error("Unauthorized: Invalid Token");
    }
  });

// Middleware สำหรับเช็ค Role ว่าเป็น "user" (นักศึกษา)
export const isUserMiddleware = new Elysia({ name: 'is-user-middleware' })
  .use(authMiddleware)
  .onBeforeHandle(({ user, set }) => {
    if (user.role !== 'user') {
      set.status = 403;
      throw new Error("Forbidden: Access denied. Requires 'user' role.");
    }
  });

// Middleware สำหรับเช็ค Role ว่าเป็น "verifier" (อาจารย์)
export const isVerifierMiddleware = new Elysia({ name: 'is-verifier-middleware' })
  .use(authMiddleware)
  .onBeforeHandle(({ user, set }) => {
    if (user.role !== 'verifier') {
      set.status = 403;
      throw new Error("Forbidden: Access denied. Requires 'verifier' role.");
    }
  });
