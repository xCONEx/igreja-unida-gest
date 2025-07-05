
-- Drop existing basic policies
DROP POLICY IF EXISTS "Users can view their organization" ON "organizations";
DROP POLICY IF EXISTS "Organization owners can update their organization" ON "organizations";
DROP POLICY IF EXISTS "Users can view users in their organization" ON "application_users";
DROP POLICY IF EXISTS "Users can insert new users" ON "application_users";
DROP POLICY IF EXISTS "Users can view teams in their organization" ON "organization_teams";
DROP POLICY IF EXISTS "Admins can manage teams" ON "organization_teams";
DROP POLICY IF EXISTS "Users can view team positions" ON "team_positions";
DROP POLICY IF EXISTS "Users can view team member positions" ON "organization_team_positions";
DROP POLICY IF EXISTS "Users can view events" ON "events";
DROP POLICY IF EXISTS "Users can view event schedules" ON "event_schedules";
DROP POLICY IF EXISTS "Users can view event blocks" ON "event_blocks";
DROP POLICY IF EXISTS "Users can view music" ON "music";
DROP POLICY IF EXISTS "Users can view files" ON "files";

-- Create security definer function to get current user's application user data
CREATE OR REPLACE FUNCTION public.get_current_app_user()
RETURNS application_users AS $$
DECLARE
  app_user application_users;
BEGIN
  -- First try to find user by email from auth.users
  SELECT au.* INTO app_user
  FROM application_users au
  WHERE au.email = (SELECT email FROM auth.users WHERE id = auth.uid());
  
  RETURN app_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create function to check if current user is admin master
CREATE OR REPLACE FUNCTION public.is_admin_master()
RETURNS boolean AS $$
BEGIN
  RETURN (SELECT email FROM auth.users WHERE id = auth.uid()) IN (
    'yuriadrskt@gmail.com', 
    'admin@igrejaunida.com', 
    'master@igrejaunida.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Organizations policies
CREATE POLICY "Admin masters can view all organizations" ON "organizations"
  FOR SELECT USING (public.is_admin_master());

CREATE POLICY "Users can view their organization" ON "organizations"
  FOR SELECT USING ((public.get_current_app_user()).organization_id = id);

CREATE POLICY "Admin masters can manage all organizations" ON "organizations"
  FOR ALL USING (public.is_admin_master());

CREATE POLICY "Organization admins can update their organization" ON "organizations"
  FOR UPDATE USING (
    (public.get_current_app_user()).organization_id = id 
    AND (public.get_current_app_user()).is_admin = true
  );

CREATE POLICY "Anyone can create organizations" ON "organizations"
  FOR INSERT WITH CHECK (true);

-- Application users policies
CREATE POLICY "Admin masters can view all users" ON "application_users"
  FOR SELECT USING (public.is_admin_master());

CREATE POLICY "Users can view users in their organization" ON "application_users"
  FOR SELECT USING (organization_id = (public.get_current_app_user()).organization_id);

CREATE POLICY "Users can view their own profile" ON "application_users"
  FOR SELECT USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admin masters can manage all users" ON "application_users"
  FOR ALL USING (public.is_admin_master());

CREATE POLICY "Organization admins can manage users in their org" ON "application_users"
  FOR ALL USING (
    organization_id = (public.get_current_app_user()).organization_id 
    AND (public.get_current_app_user()).is_admin = true
  );

CREATE POLICY "Anyone can create users" ON "application_users"
  FOR INSERT WITH CHECK (true);

-- Organization teams policies
CREATE POLICY "Admin masters can view all teams" ON "organization_teams"
  FOR SELECT USING (public.is_admin_master());

CREATE POLICY "Users can view teams in their organization" ON "organization_teams"
  FOR SELECT USING (organization_id = (public.get_current_app_user()).organization_id);

CREATE POLICY "Admin masters can manage all teams" ON "organization_teams"
  FOR ALL USING (public.is_admin_master());

CREATE POLICY "Organization admins can manage teams" ON "organization_teams"
  FOR ALL USING (
    organization_id = (public.get_current_app_user()).organization_id 
    AND (public.get_current_app_user()).is_admin = true
  );

-- Team positions policies
CREATE POLICY "Admin masters can view all positions" ON "team_positions"
  FOR SELECT USING (public.is_admin_master());

CREATE POLICY "Users can view positions in their org teams" ON "team_positions"
  FOR SELECT USING (
    organization_team_id IN (
      SELECT id FROM organization_teams 
      WHERE organization_id = (public.get_current_app_user()).organization_id
    )
  );

CREATE POLICY "Admin masters can manage all positions" ON "team_positions"
  FOR ALL USING (public.is_admin_master());

CREATE POLICY "Organization admins can manage positions" ON "team_positions"
  FOR ALL USING (
    organization_team_id IN (
      SELECT id FROM organization_teams 
      WHERE organization_id = (public.get_current_app_user()).organization_id
    )
    AND (public.get_current_app_user()).is_admin = true
  );

-- Organization team positions policies
CREATE POLICY "Admin masters can view all team member positions" ON "organization_team_positions"
  FOR SELECT USING (public.is_admin_master());

CREATE POLICY "Users can view team positions in their org" ON "organization_team_positions"
  FOR SELECT USING (
    team_position_id IN (
      SELECT tp.id FROM team_positions tp
      JOIN organization_teams ot ON tp.organization_team_id = ot.id
      WHERE ot.organization_id = (public.get_current_app_user()).organization_id
    )
  );

CREATE POLICY "Admin masters can manage all team positions" ON "organization_team_positions"
  FOR ALL USING (public.is_admin_master());

CREATE POLICY "Organization admins can manage team positions" ON "organization_team_positions"
  FOR ALL USING (
    team_position_id IN (
      SELECT tp.id FROM team_positions tp
      JOIN organization_teams ot ON tp.organization_team_id = ot.id
      WHERE ot.organization_id = (public.get_current_app_user()).organization_id
    )
    AND (public.get_current_app_user()).is_admin = true
  );

-- Events policies
CREATE POLICY "Admin masters can view all events" ON "events"
  FOR SELECT USING (public.is_admin_master());

CREATE POLICY "Users can view events in their organization" ON "events"
  FOR SELECT USING (organization_id = (public.get_current_app_user()).organization_id);

CREATE POLICY "Admin masters can manage all events" ON "events"
  FOR ALL USING (public.is_admin_master());

CREATE POLICY "Users with event permission can manage events" ON "events"
  FOR ALL USING (
    organization_id = (public.get_current_app_user()).organization_id 
    AND ((public.get_current_app_user()).can_organize_events = true OR (public.get_current_app_user()).is_admin = true)
  );

-- Event schedules policies
CREATE POLICY "Admin masters can view all event schedules" ON "event_schedules"
  FOR SELECT USING (public.is_admin_master());

CREATE POLICY "Users can view schedules for their org events" ON "event_schedules"
  FOR SELECT USING (
    event_id IN (
      SELECT id FROM events 
      WHERE organization_id = (public.get_current_app_user()).organization_id
    )
  );

CREATE POLICY "Admin masters can manage all event schedules" ON "event_schedules"
  FOR ALL USING (public.is_admin_master());

CREATE POLICY "Users with event permission can manage schedules" ON "event_schedules"
  FOR ALL USING (
    event_id IN (
      SELECT id FROM events 
      WHERE organization_id = (public.get_current_app_user()).organization_id
    )
    AND ((public.get_current_app_user()).can_organize_events = true OR (public.get_current_app_user()).is_admin = true)
  );

-- Event blocks policies  
CREATE POLICY "Admin masters can view all event blocks" ON "event_blocks"
  FOR SELECT USING (public.is_admin_master());

CREATE POLICY "Users can view blocks for their org events" ON "event_blocks"
  FOR SELECT USING (
    event_id IN (
      SELECT id FROM events 
      WHERE organization_id = (public.get_current_app_user()).organization_id
    )
  );

CREATE POLICY "Admin masters can manage all event blocks" ON "event_blocks"
  FOR ALL USING (public.is_admin_master());

CREATE POLICY "Users with event permission can manage blocks" ON "event_blocks"
  FOR ALL USING (
    event_id IN (
      SELECT id FROM events 
      WHERE organization_id = (public.get_current_app_user()).organization_id
    )
    AND ((public.get_current_app_user()).can_organize_events = true OR (public.get_current_app_user()).is_admin = true)
  );

-- Music policies
CREATE POLICY "Admin masters can view all music" ON "music"
  FOR SELECT USING (public.is_admin_master());

CREATE POLICY "Users can view music in their organization" ON "music"
  FOR SELECT USING (organization_id = (public.get_current_app_user()).organization_id);

CREATE POLICY "Admin masters can manage all music" ON "music"
  FOR ALL USING (public.is_admin_master());

CREATE POLICY "Users with media permission can manage music" ON "music"
  FOR ALL USING (
    organization_id = (public.get_current_app_user()).organization_id 
    AND ((public.get_current_app_user()).can_manage_media = true OR (public.get_current_app_user()).is_admin = true)
  );

-- Files policies
CREATE POLICY "Admin masters can view all files" ON "files"
  FOR SELECT USING (public.is_admin_master());

CREATE POLICY "Users can view files in their organization" ON "files"
  FOR SELECT USING (organization_id = (public.get_current_app_user()).organization_id);

CREATE POLICY "Admin masters can manage all files" ON "files"
  FOR ALL USING (public.is_admin_master());

CREATE POLICY "Users with media permission can manage files" ON "files"
  FOR ALL USING (
    organization_id = (public.get_current_app_user()).organization_id 
    AND ((public.get_current_app_user()).can_manage_media = true OR (public.get_current_app_user()).is_admin = true)
  );

-- Insert a default organization for testing
INSERT INTO organizations (name, owner_id, subscription_plan, max_users, max_storage_gb)
VALUES ('Igreja Unida Padrão', 1, 'Free', 15, 0.5)
ON CONFLICT DO NOTHING;
