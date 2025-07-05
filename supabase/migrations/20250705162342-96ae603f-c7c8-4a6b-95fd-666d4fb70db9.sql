
-- Enable RLS on all tables if not already enabled
ALTER TABLE "organizations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "application_users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "organization_teams" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "team_positions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "organization_team_positions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "event_schedules" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "event_blocks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "music" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "files" ENABLE ROW LEVEL SECURITY;

-- Drop and recreate the admin master function with better logic
DROP FUNCTION IF EXISTS public.is_admin_master();
CREATE OR REPLACE FUNCTION public.is_admin_master()
RETURNS boolean AS $$
DECLARE
  user_email text;
BEGIN
  SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
  
  IF user_email IS NULL THEN
    RETURN false;
  END IF;
  
  RETURN user_email IN (
    'yuriadrskt@gmail.com', 
    'admin@igrejaunida.com', 
    'master@igrejaunida.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recreate get_current_app_user function with better error handling
DROP FUNCTION IF EXISTS public.get_current_app_user();
CREATE OR REPLACE FUNCTION public.get_current_app_user()
RETURNS application_users AS $$
DECLARE
  app_user application_users;
  user_email text;
BEGIN
  SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
  
  IF user_email IS NULL THEN
    RETURN NULL;
  END IF;
  
  SELECT au.* INTO app_user
  FROM application_users au
  WHERE au.email = user_email;
  
  RETURN app_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Admin masters can view all organizations" ON "organizations";
DROP POLICY IF EXISTS "Users can view their organization" ON "organizations";
DROP POLICY IF EXISTS "Admin masters can manage all organizations" ON "organizations";
DROP POLICY IF EXISTS "Organization admins can update their organization" ON "organizations";
DROP POLICY IF EXISTS "Anyone can create organizations" ON "organizations";

DROP POLICY IF EXISTS "Admin masters can view all users" ON "application_users";
DROP POLICY IF EXISTS "Users can view users in their organization" ON "application_users";
DROP POLICY IF EXISTS "Users can view their own profile" ON "application_users";
DROP POLICY IF EXISTS "Admin masters can manage all users" ON "application_users";
DROP POLICY IF EXISTS "Organization admins can manage users in their org" ON "application_users";
DROP POLICY IF EXISTS "Anyone can create users" ON "application_users";

-- Organizations policies - more permissive for admin masters
CREATE POLICY "Enable all access for admin masters on organizations" ON "organizations"
  FOR ALL USING (public.is_admin_master());

CREATE POLICY "Users can view their organization" ON "organizations"
  FOR SELECT USING (
    NOT public.is_admin_master() AND 
    (public.get_current_app_user()).organization_id = id
  );

CREATE POLICY "Organization admins can update their organization" ON "organizations"
  FOR UPDATE USING (
    NOT public.is_admin_master() AND
    (public.get_current_app_user()).organization_id = id AND 
    (public.get_current_app_user()).is_admin = true
  );

CREATE POLICY "Anyone can create organizations" ON "organizations"
  FOR INSERT WITH CHECK (true);

-- Application users policies - more permissive for admin masters
CREATE POLICY "Enable all access for admin masters on users" ON "application_users"
  FOR ALL USING (public.is_admin_master());

CREATE POLICY "Users can view users in their organization" ON "application_users"
  FOR SELECT USING (
    NOT public.is_admin_master() AND
    organization_id = (public.get_current_app_user()).organization_id
  );

CREATE POLICY "Users can view their own profile" ON "application_users"
  FOR SELECT USING (
    NOT public.is_admin_master() AND
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "Organization admins can manage users in their org" ON "application_users"
  FOR ALL USING (
    NOT public.is_admin_master() AND
    organization_id = (public.get_current_app_user()).organization_id AND 
    (public.get_current_app_user()).is_admin = true
  );

CREATE POLICY "Anyone can create users" ON "application_users"
  FOR INSERT WITH CHECK (true);

-- Organization teams policies
CREATE POLICY "Enable all access for admin masters on teams" ON "organization_teams"
  FOR ALL USING (public.is_admin_master());

CREATE POLICY "Users can view teams in their organization" ON "organization_teams"
  FOR SELECT USING (
    NOT public.is_admin_master() AND
    organization_id = (public.get_current_app_user()).organization_id
  );

CREATE POLICY "Organization admins can manage teams" ON "organization_teams"
  FOR ALL USING (
    NOT public.is_admin_master() AND
    organization_id = (public.get_current_app_user()).organization_id AND 
    (public.get_current_app_user()).is_admin = true
  );

-- Team positions policies
CREATE POLICY "Enable all access for admin masters on positions" ON "team_positions"
  FOR ALL USING (public.is_admin_master());

CREATE POLICY "Users can view positions in their org teams" ON "team_positions"
  FOR SELECT USING (
    NOT public.is_admin_master() AND
    organization_team_id IN (
      SELECT id FROM organization_teams 
      WHERE organization_id = (public.get_current_app_user()).organization_id
    )
  );

CREATE POLICY "Organization admins can manage positions" ON "team_positions"
  FOR ALL USING (
    NOT public.is_admin_master() AND
    organization_team_id IN (
      SELECT id FROM organization_teams 
      WHERE organization_id = (public.get_current_app_user()).organization_id
    ) AND 
    (public.get_current_app_user()).is_admin = true
  );

-- Organization team positions policies
CREATE POLICY "Enable all access for admin masters on team positions" ON "organization_team_positions"
  FOR ALL USING (public.is_admin_master());

CREATE POLICY "Users can view team positions in their org" ON "organization_team_positions"
  FOR SELECT USING (
    NOT public.is_admin_master() AND
    team_position_id IN (
      SELECT tp.id FROM team_positions tp
      JOIN organization_teams ot ON tp.organization_team_id = ot.id
      WHERE ot.organization_id = (public.get_current_app_user()).organization_id
    )
  );

CREATE POLICY "Organization admins can manage team positions" ON "organization_team_positions"
  FOR ALL USING (
    NOT public.is_admin_master() AND
    team_position_id IN (
      SELECT tp.id FROM team_positions tp
      JOIN organization_teams ot ON tp.organization_team_id = ot.id
      WHERE ot.organization_id = (public.get_current_app_user()).organization_id
    ) AND 
    (public.get_current_app_user()).is_admin = true
  );

-- Events policies
CREATE POLICY "Enable all access for admin masters on events" ON "events"
  FOR ALL USING (public.is_admin_master());

CREATE POLICY "Users can view events in their organization" ON "events"
  FOR SELECT USING (
    NOT public.is_admin_master() AND
    organization_id = (public.get_current_app_user()).organization_id
  );

CREATE POLICY "Users with event permission can manage events" ON "events"
  FOR ALL USING (
    NOT public.is_admin_master() AND
    organization_id = (public.get_current_app_user()).organization_id AND 
    ((public.get_current_app_user()).can_organize_events = true OR (public.get_current_app_user()).is_admin = true)
  );

-- Event schedules policies
CREATE POLICY "Enable all access for admin masters on event schedules" ON "event_schedules"
  FOR ALL USING (public.is_admin_master());

CREATE POLICY "Users can view schedules for their org events" ON "event_schedules"
  FOR SELECT USING (
    NOT public.is_admin_master() AND
    event_id IN (
      SELECT id FROM events 
      WHERE organization_id = (public.get_current_app_user()).organization_id
    )
  );

CREATE POLICY "Users with event permission can manage schedules" ON "event_schedules"
  FOR ALL USING (
    NOT public.is_admin_master() AND
    event_id IN (
      SELECT id FROM events 
      WHERE organization_id = (public.get_current_app_user()).organization_id
    ) AND 
    ((public.get_current_app_user()).can_organize_events = true OR (public.get_current_app_user()).is_admin = true)
  );

-- Event blocks policies  
CREATE POLICY "Enable all access for admin masters on event blocks" ON "event_blocks"
  FOR ALL USING (public.is_admin_master());

CREATE POLICY "Users can view blocks for their org events" ON "event_blocks"
  FOR SELECT USING (
    NOT public.is_admin_master() AND
    event_id IN (
      SELECT id FROM events 
      WHERE organization_id = (public.get_current_app_user()).organization_id
    )
  );

CREATE POLICY "Users with event permission can manage blocks" ON "event_blocks"
  FOR ALL USING (
    NOT public.is_admin_master() AND
    event_id IN (
      SELECT id FROM events 
      WHERE organization_id = (public.get_current_app_user()).organization_id
    ) AND 
    ((public.get_current_app_user()).can_organize_events = true OR (public.get_current_app_user()).is_admin = true)
  );

-- Music policies
CREATE POLICY "Enable all access for admin masters on music" ON "music"
  FOR ALL USING (public.is_admin_master());

CREATE POLICY "Users can view music in their organization" ON "music"
  FOR SELECT USING (
    NOT public.is_admin_master() AND
    organization_id = (public.get_current_app_user()).organization_id
  );

CREATE POLICY "Users with media permission can manage music" ON "music"
  FOR ALL USING (
    NOT public.is_admin_master() AND
    organization_id = (public.get_current_app_user()).organization_id AND 
    ((public.get_current_app_user()).can_manage_media = true OR (public.get_current_app_user()).is_admin = true)
  );

-- Files policies
CREATE POLICY "Enable all access for admin masters on files" ON "files"
  FOR ALL USING (public.is_admin_master());

CREATE POLICY "Users can view files in their organization" ON "files"
  FOR SELECT USING (
    NOT public.is_admin_master() AND
    organization_id = (public.get_current_app_user()).organization_id
  );

CREATE POLICY "Users with media permission can manage files" ON "files"
  FOR ALL USING (
    NOT public.is_admin_master() AND
    organization_id = (public.get_current_app_user()).organization_id AND 
    ((public.get_current_app_user()).can_manage_media = true OR (public.get_current_app_user()).is_admin = true)
  );
