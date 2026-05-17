-- 侨批生成器 · 「先生」 Supabase 表结构
-- 在 Supabase Dashboard → SQL Editor → New Query 里粘贴运行一次即可

create table if not exists public.letters (
  id text primary key,
  style text not null check (style in ('merchant', 'maiden', 'youth', 'remembrance')),
  body text not null,
  signature text not null default '',
  created_at timestamptz not null default now()
);

-- 启用 RLS,只允许读,服务端写入用 service_role key 绕过 RLS
alter table public.letters enable row level security;

-- 任何人可以按 id 读取(用于分享链接打开)
drop policy if exists "letters_anyone_select" on public.letters;
create policy "letters_anyone_select"
  on public.letters for select
  to anon, authenticated
  using (true);

-- 7 天前的信件自动清理(可选,Supabase Dashboard → Database → Cron)
-- create extension if not exists pg_cron;
-- select cron.schedule('purge_old_letters', '0 4 * * *',
--   $$delete from public.letters where created_at < now() - interval '90 days'$$);
