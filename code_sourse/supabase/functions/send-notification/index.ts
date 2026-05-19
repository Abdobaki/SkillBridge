import { createClient } from "https://esm.sh/@supabase/supabase-js@2.103.0";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "SkillBridge", email: "abdelbaki.m.28@gmail.com" },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Failed to send email to ${to}:`, errorText);
    return false;
  }
  return true;
}

// ── Email templates ────────────────────────────────────────────────────────

function enrollmentConfirmationHtml(userName: string, courseTitle: string) {
  return `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:24px;">🎓 You're Enrolled!</h1>
      </div>
      <div style="padding:32px;">
        <p style="color:#334155;font-size:16px;margin-bottom:8px;">Hi <strong>${userName}</strong>,</p>
        <p style="color:#64748b;font-size:14px;line-height:1.6;">
          Great news! You have successfully joined the course:
        </p>
        <div style="background:white;border-radius:12px;padding:24px;margin:24px 0;border:1px solid #e2e8f0;border-left:4px solid #6366f1;">
          <h2 style="color:#1e293b;margin:0;font-size:20px;">${courseTitle}</h2>
        </div>
        <p style="color:#64748b;font-size:14px;line-height:1.6;">
          You can access the course chat and track your progress from the app.<br/>
          Note: You have a <strong>24-hour window</strong> to leave the course if you change your mind.
        </p>
      </div>
      <div style="background:#f1f5f9;padding:16px 32px;text-align:center;">
        <p style="color:#94a3b8;font-size:12px;margin:0;">SkillBridge — Bridge the Gap Between Skills & Opportunity</p>
      </div>
    </div>`;
}

function newCourseHtml(userName: string, courseTitle: string, instructor: string, price: number, category: string) {
  return `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:24px;">📚 New Course Available!</h1>
      </div>
      <div style="padding:32px;">
        <p style="color:#334155;font-size:16px;margin-bottom:8px;">Hi <strong>${userName}</strong>,</p>
        <p style="color:#64748b;font-size:14px;line-height:1.6;">
          A new course has just been approved on SkillBridge:
        </p>
        <div style="background:white;border-radius:12px;padding:24px;margin:24px 0;border:1px solid #e2e8f0;">
          <h2 style="color:#1e293b;margin:0 0 8px 0;font-size:20px;">${courseTitle}</h2>
          <p style="color:#6366f1;margin:0 0 12px 0;font-size:14px;font-weight:600;">by ${instructor}</p>
          <div style="display:flex;gap:16px;flex-wrap:wrap;">
            <span style="color:#64748b;font-size:13px;">🏷️ ${category}</span>
            <span style="color:#059669;font-size:13px;font-weight:600;">💶 €${price}</span>
          </div>
        </div>
        <p style="color:#64748b;font-size:14px;line-height:1.6;">
          Open the SkillBridge app to view full details and join the course!
        </p>
      </div>
      <div style="background:#f1f5f9;padding:16px 32px;text-align:center;">
        <p style="color:#94a3b8;font-size:12px;margin:0;">SkillBridge — Bridge the Gap Between Skills & Opportunity</p>
      </div>
    </div>`;
}

function newJobHtml(userName: string, jobTitle: string, company: string, location: string, deadline: string) {
  return `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:24px;">💼 New Job Opportunity!</h1>
      </div>
      <div style="padding:32px;">
        <p style="color:#334155;font-size:16px;margin-bottom:8px;">Hi <strong>${userName}</strong>,</p>
        <p style="color:#64748b;font-size:14px;line-height:1.6;">
          A new job opportunity matching your profile is now available:
        </p>
        <div style="background:white;border-radius:12px;padding:24px;margin:24px 0;border:1px solid #e2e8f0;">
          <h2 style="color:#1e293b;margin:0 0 8px 0;font-size:20px;">${jobTitle}</h2>
          <p style="color:#6366f1;margin:0 0 12px 0;font-size:14px;font-weight:600;">${company}</p>
          <div style="display:flex;gap:16px;flex-wrap:wrap;">
            <span style="color:#64748b;font-size:13px;">📍 ${location}</span>
            <span style="color:#f59e0b;font-size:13px;font-weight:600;">📅 Deadline: ${deadline}</span>
          </div>
        </div>
        <p style="color:#64748b;font-size:14px;line-height:1.6;">
          Don't miss this opportunity! Open SkillBridge to apply now.
        </p>
      </div>
      <div style="background:#f1f5f9;padding:16px 32px;text-align:center;">
        <p style="color:#94a3b8;font-size:12px;margin:0;">SkillBridge — Bridge the Gap Between Skills & Opportunity</p>
      </div>
    </div>`;
}

// ── Main handler ───────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const body = await req.json();
    const { type, payload } = body;

    // type: "enrollment_confirmation" | "new_course" | "new_job"
    // payload: varies by type

    let emailsSent = 0;

    // ── ENROLLMENT CONFIRMATION ────────────────────────────────────────────
    if (type === "enrollment_confirmation") {
      const { userEmail, userName, courseTitle } = payload;

      // Check if user wants enrollment notifications
      const { data: user } = await supabase
        .from("users")
        .select("notify_enrollments")
        .eq("email", userEmail)
        .single();

      // Default to true if column doesn't exist yet
      const wantsNotification = user?.notify_enrollments !== false;

      if (wantsNotification) {
        const sent = await sendEmail(
          userEmail,
          `🎓 You're enrolled in "${courseTitle}"!`,
          enrollmentConfirmationHtml(userName, courseTitle)
        );
        if (sent) emailsSent++;
      }
    }

    // ── NEW COURSE APPROVED ────────────────────────────────────────────────
    else if (type === "new_course") {
      const { courseTitle, instructor, price, category } = payload;

      // Get all users who want new course notifications
      const { data: users } = await supabase
        .from("users")
        .select("email, name, notify_new_courses")
        .neq("role", "admin");

      if (users) {
        for (const user of users) {
          if (user.notify_new_courses === false) continue;
          const sent = await sendEmail(
            user.email,
            `📚 New course: "${courseTitle}" is now available!`,
            newCourseHtml(user.name || "there", courseTitle, instructor, price, category)
          );
          if (sent) emailsSent++;
        }
      }
    }

    // ── NEW JOB APPROVED ──────────────────────────────────────────────────
    else if (type === "new_job") {
      const { jobTitle, company, location, deadline } = payload;

      // Get all users who want job update notifications
      const { data: users } = await supabase
        .from("users")
        .select("email, name, notify_job_updates")
        .eq("role", "user");

      if (users) {
        for (const user of users) {
          if (user.notify_job_updates === false) continue;
          const sent = await sendEmail(
            user.email,
            `💼 New job: "${jobTitle}" at ${company}`,
            newJobHtml(user.name || "there", jobTitle, company, location, deadline)
          );
          if (sent) emailsSent++;
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, emailsSent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("send-notification error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
