# Setting a User as Admin

Admins are determined by the `role` column in the `profiles` table in Supabase.

## How to Make a User an Admin

1. Go to **Supabase Dashboard** → **Table Editor** → **profiles**
2. Find the user by their `email` or `id` (matches `auth.users.id`)
3. Set `role` to `admin`

Valid roles: `owner` (default), `manager`, `admin`

## Via SQL

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'user@example.com';
```

## New Users

When a user signs up, the `handle_new_user` trigger creates a profile with `role = 'owner'` by default. Change it to `admin` in the Table Editor or via SQL above.
