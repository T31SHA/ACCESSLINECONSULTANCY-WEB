-- Kenya Data Protection Act 2019 retention policy.
-- Executed daily by /api/cron/retention (src/lib/server/retention.ts), scheduled in vercel.json.
-- Keep this file and retention.ts in sync.
DELETE FROM leads WHERE status = 'spam' AND created_at < now() - interval '30 days';
-- CV objects in R2 are deleted by the job before the rows below are removed.
DELETE FROM job_applications WHERE created_at < now() - interval '12 months';
