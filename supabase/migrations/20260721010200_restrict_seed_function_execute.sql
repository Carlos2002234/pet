-- El linter de seguridad de Supabase marcó seed_default_categories() como
-- ejecutable públicamente vía /rest/v1/rpc (SECURITY DEFINER + schema public).
-- Solo debe dispararla el trigger on_auth_user_created_seed_categories.
revoke execute on function public.seed_default_categories() from public, anon, authenticated;
