-- Kenya Data Protection Act 2019 retention policy.
-- Run daily (Neon scheduled job / Vercel cron hitting /api/cron/retention).
DELETE FROM leads WHERE status = 'spam' AND created_at < now() - interval '30 days';
DELETE FROM job_applications WHERE created_at < now() - interval '12 months';
-- CV objects in R2 are removed by the cron route before rows are deleted.
