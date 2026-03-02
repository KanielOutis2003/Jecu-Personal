-- SQL Reset Script for Student Survival App
-- RUN THIS IN SUPABASE SQL EDITOR

-- 1. Drop existing tables and functions to start clean
DROP TRIGGER IF EXISTS on_task_created ON tasks;
DROP TRIGGER IF EXISTS on_health_log_upsert ON health_logs;
DROP FUNCTION IF EXISTS notify_task_created();
DROP FUNCTION IF EXISTS notify_health_reminder();
DROP TABLE IF EXISTS ojt_logs;
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS budget;
DROP TABLE IF EXISTS health_logs;
DROP TABLE IF EXISTS tasks;

-- 2. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Re-create Tables with correct schema
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('project', 'ojt', 'assignment')),
  due DATE,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
  done BOOLEAN DEFAULT FALSE,
  email_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE health_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  date DATE NOT NULL,
  water INTEGER DEFAULT 0,
  sleep NUMERIC DEFAULT 0,
  steps INTEGER DEFAULT 0,
  meals JSONB DEFAULT '[]',
  habits JSONB DEFAULT '{}',
  email_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE TABLE budget (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  month TEXT NOT NULL, -- Format: YYYY-MM
  allowance NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, month)
);

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  label TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  category TEXT CHECK (category IN ('food', 'transport', 'school', 'other')),
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ojt_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
  date DATE NOT NULL,
  activities TEXT NOT NULL,
  hours NUMERIC DEFAULT 8,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ojt_logs ENABLE ROW LEVEL SECURITY;

-- 5. Create Security Policies (One rule per table for simplicity and reliability)
CREATE POLICY "manage_tasks" ON tasks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "manage_health" ON health_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "manage_budget" ON budget FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "manage_expenses" ON expenses FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "manage_ojt" ON ojt_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6. Notification Logic
CREATE OR REPLACE FUNCTION notify_task_created()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email_notifications = TRUE THEN
    -- In a real scenario, you'd call a Supabase Edge Function here
    -- Example: PERFORM net.http_post('https://your-function.supabase.co/send-email', ...);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_health_reminder()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email_notifications = TRUE AND NEW.water < 8 THEN
    -- Example logic: notify if water target is not met
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Triggers for notifications
CREATE TRIGGER on_task_created
  AFTER INSERT ON tasks
  FOR EACH ROW EXECUTE FUNCTION notify_task_created();

CREATE TRIGGER on_health_log_upsert
  AFTER INSERT OR UPDATE ON health_logs
  FOR EACH ROW EXECUTE FUNCTION notify_health_reminder();
