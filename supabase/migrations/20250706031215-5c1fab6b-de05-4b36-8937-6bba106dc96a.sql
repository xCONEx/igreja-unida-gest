
-- Conceder permissões necessárias para a função is_admin_master
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT SELECT ON auth.users TO authenticated;

-- Recriar a função is_admin_master com permissões corretas
DROP FUNCTION IF EXISTS public.is_admin_master();
CREATE OR REPLACE FUNCTION public.is_admin_master()
RETURNS boolean AS $$
DECLARE
  user_email text;
BEGIN
  -- Get email from auth.users
  SELECT email INTO user_email 
  FROM auth.users 
  WHERE id = auth.uid();
  
  -- Return true if user is admin master
  RETURN user_email IN (
    'yuriadrskt@gmail.com', 
    'admin@igrejaunida.com', 
    'master@igrejaunida.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Enable all access for admin masters on organizations" ON "organizations";
DROP POLICY IF EXISTS "Users can view their organization" ON "organizations";
DROP POLICY IF EXISTS "Organization admins can update their organization" ON "organizations";
DROP POLICY IF EXISTS "Anyone can create organizations" ON "organizations";
DROP POLICY IF EXISTS "Allow insert to all" ON "organizations";
DROP POLICY IF EXISTS "Allow read to all" ON "organizations";

DROP POLICY IF EXISTS "Enable all access for admin masters on users" ON "application_users";
DROP POLICY IF EXISTS "Users can view users in their organization" ON "application_users";
DROP POLICY IF EXISTS "Users can view their own profile" ON "application_users";
DROP POLICY IF EXISTS "Organization admins can manage users in their org" ON "application_users";
DROP POLICY IF EXISTS "Anyone can create users" ON "application_users";
DROP POLICY IF EXISTS "Allow read to all" ON "application_users";

-- Organizations policies - simple and permissive for admin masters
CREATE POLICY "Admin masters have full access to organizations" ON "organizations"
  FOR ALL 
  TO authenticated
  USING (public.is_admin_master())
  WITH CHECK (public.is_admin_master());

CREATE POLICY "Users can view their own organization" ON "organizations"
  FOR SELECT 
  TO authenticated
  USING (
    NOT public.is_admin_master() AND 
    id = (SELECT organization_id FROM application_users WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Users can create organizations" ON "organizations"
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Organization owners can update their org" ON "organizations"
  FOR UPDATE 
  TO authenticated
  USING (
    NOT public.is_admin_master() AND
    owner_id = (SELECT id FROM application_users WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- Application users policies - simple and clear
CREATE POLICY "Admin masters have full access to users" ON "application_users"
  FOR ALL 
  TO authenticated
  USING (public.is_admin_master())
  WITH CHECK (public.is_admin_master());

CREATE POLICY "Users can view users in same organization" ON "application_users"
  FOR SELECT 
  TO authenticated
  USING (
    NOT public.is_admin_master() AND
    organization_id = (SELECT organization_id FROM application_users WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

CREATE POLICY "Users can create new users" ON "application_users"
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Organization admins can manage their users" ON "application_users"
  FOR ALL 
  TO authenticated
  USING (
    NOT public.is_admin_master() AND
    organization_id = (SELECT organization_id FROM application_users WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())) AND
    (SELECT is_admin FROM application_users WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())) = true
  );

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.is_admin_master() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_app_user() TO authenticated;
