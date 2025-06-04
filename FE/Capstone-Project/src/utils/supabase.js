import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kbtzkglpwdzzymbetvjw.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtidHprZ2xwd2R6enltYmV0dmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NjgwNDMsImV4cCI6MjA2MTA0NDA0M30.i6SF-El1h5tdlB1Up1YxdjxHHuvp6KitFkJJNqZUJLY";

// Tạo client với options để cải thiện kết nối realtime
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  realtime: {
    timeout: 60000, // tăng timeout lên 60s
    params: {
      eventsPerSecond: 10,
    },
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      "x-application-name": "capstone-project",
    },
  },
});

// Tạo kênh theo dõi trạng thái kết nối
const STATUS_CHANNEL = supabase.channel("status-channel");

// Đăng ký sự kiện kết nối và lỗi
STATUS_CHANNEL.on("system", { event: "connected" }, () => {
  console.log("Supabase realtime connection established");
})
  .on("system", { event: "disconnected" }, () => {
    console.log("Supabase realtime connection closed");
  })
  .on("system", { event: "error" }, (e) => {
    console.error("Supabase realtime error:", e);
  })
  .subscribe((status) => {
    console.log(`Status channel subscription status: ${status}`);
  });

export { supabase }; // Named export
export default supabase; // Default export (giữ nguyên để tương thích với code hiện tại)
