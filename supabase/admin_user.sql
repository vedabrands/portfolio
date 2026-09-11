-- ==============================================================================
-- SUPABASE ADMIN USER PROVISIONING SCRIPT
-- Email: unifiedram@gmail.com
-- Temporary Password: VedaAdmin2026!Sec#9xK
-- ==============================================================================

DO $$
DECLARE
  new_user_id UUID := gen_random_uuid();
  user_email TEXT := 'unifiedram@gmail.com';
  user_password TEXT := 'VedaAdmin2026!Sec#9xK'; -- Change on first login
  encrypted_pw TEXT;
BEGIN
  -- Check if user already exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = user_email) THEN
    encrypted_pw := crypt(user_password, gen_salt('bf'));

    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      user_email,
      encrypted_pw,
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"role":"admin"}'::jsonb,
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    -- Insert identity record
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      new_user_id,
      format('{"sub":"%s","email":"%s"}', new_user_id::text, user_email)::jsonb,
      'email',
      user_email,
      now(),
      now(),
      now()
    );

    RAISE NOTICE 'Admin user % created successfully with ID %', user_email, new_user_id;
  ELSE
    RAISE NOTICE 'User % already exists in auth.users', user_email;
  END IF;
END $$;
