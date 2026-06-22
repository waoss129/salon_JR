// src/lib/supabase/server.ts
export async function createClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: null } }), // Giả lập chưa đăng nhập
    },
  };
}
