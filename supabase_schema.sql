-- SQL Schema for Student Survival App

-- 1. Tasks Table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('project', 'ojt', 'assignment')),
  due DATE,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
  done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Health Logs Table
CREATE TABLE health_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  water INTEGER DEFAULT 0,
  sleep NUMERIC DEFAULT 0,
  steps INTEGER DEFAULT 0,
  meals JSONB DEFAULT '[]',
  habits JSONB DEFAULT '{}',
  UNIQUE(user_id, date)
);

-- 3. Budget Table
CREATE TABLE budget (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  month TEXT NOT NULL, -- Format: YYYY-MM
  allowance NUMERIC DEFAULT 0,
  UNIQUE(user_id, month)
);

-- 4. Expenses Table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  label TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  category TEXT CHECK (category IN ('food', 'transport', 'school', 'other')),
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. OJT Logs Table
CREATE TABLE ojt_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  activities TEXT NOT NULL,
  hours NUMERIC DEFAULT 8,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ojt_logs ENABLE ROW LEVEL SECURITY;

-- Create Policies (Example for tasks)
CREATE POLICY "Users can only see their own tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id);
-- (Repeat similar policies for other tables)
