import { createClient } from "https://esm.sh/@supabase/supabase-js@2.103.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Job Reminders <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`Failed to send email to ${to}:`, errorText);
    return false;
  }
  return true;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Use service role to access all data
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Calculate the date that is exactly 2 days from now
    const now = new Date();
    const twoDaysFromNow = new Date(now);
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

    // Format as YYYY-MM-DD for comparison
    const targetDate = twoDaysFromNow.toISOString().split("T")[0];

    console.log(`Checking for jobs with deadline on: ${targetDate}`);

    // Find all approved jobs where the deadline is exactly 2 days away
    const { data: jobs, error: jobsError } = await supabase
      .from("job_announcements")
      .select("*")
      .eq("post_status", "approved")
      .gte("application_deadline", targetDate)
      .lt("application_deadline", targetDate + "T23:59:59");

    if (jobsError) {
      console.error("Error fetching jobs:", jobsError);
      throw jobsError;
    }

    if (!jobs || jobs.length === 0) {
      console.log("No jobs with deadline in 2 days found.");
      return new Response(
        JSON.stringify({ message: "No jobs with upcoming deadlines.", emailsSent: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${jobs.length} job(s) with deadline in 2 days.`);

    let totalEmailsSent = 0;
    const debugInfo = {
      jobsFound: jobs.length,
      applicationsFound: 0,
      emailFailures: [] as string[],
    };

    for (const job of jobs) {
      // Find all users who applied to this job and haven't been reminded yet
      const { data: applications, error: appsError } = await supabase
        .from("job_applications")
        .select("*")
        .eq("job_id", job.id)
        .eq("reminder_sent", false);

      if (appsError) {
        console.error(`Error fetching applications for job ${job.id}:`, appsError);
        continue;
      }

      if (!applications || applications.length === 0) {
        console.log(`No pending reminders for job: ${job.title}`);
        continue;
      }

      console.log(`Sending ${applications.length} reminder(s) for job: ${job.title}`);

      debugInfo.applicationsFound += applications.length;

      for (const app of applications) {
        const emailHtml = `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 16px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">⏰ Deadline Reminder</h1>
            </div>
            <div style="padding: 32px;">
              <p style="color: #334155; font-size: 16px; margin-bottom: 8px;">
                Hi <strong>${app.user_name}</strong>,
              </p>
              <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
                This is a friendly reminder that the application deadline for the following job is <strong style="color: #f59e0b;">2 days away</strong>:
              </p>
              <div style="background: white; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #e2e8f0;">
                <h2 style="color: #1e293b; margin: 0 0 8px 0; font-size: 20px;">${job.title}</h2>
                <p style="color: #6366f1; margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">${job.company}</p>
                <div style="display: flex; gap: 16px; flex-wrap: wrap;">
                  <span style="color: #64748b; font-size: 13px;">📍 ${job.location}</span>
                  <span style="color: #f59e0b; font-size: 13px; font-weight: 600;">📅 Deadline: ${job.application_deadline}</span>
                </div>
              </div>
              <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
                Make sure to complete your application before the deadline. Good luck! 🍀
              </p>
            </div>
            <div style="background: #f1f5f9; padding: 16px 32px; text-align: center;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                You received this email because you applied to this job on our platform.
              </p>
            </div>
          </div>
        `;

        const sent = await sendEmail(
          app.user_email,
          `⏰ Reminder: "${job.title}" deadline is in 2 days!`,
          emailHtml
        );

        if (sent) {
          // Mark reminder as sent
          await supabase
            .from("job_applications")
            .update({ reminder_sent: true })
            .eq("id", app.id);
          totalEmailsSent++;
        } else {
          debugInfo.emailFailures.push(`Failed to send to ${app.user_email}`);
        }
      }
    }

    console.log(`Done. Total emails sent: ${totalEmailsSent}`);

    return new Response(
      JSON.stringify({
        message: `Reminders sent successfully.`,
        emailsSent: totalEmailsSent,
        debug: debugInfo,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edge Function error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
