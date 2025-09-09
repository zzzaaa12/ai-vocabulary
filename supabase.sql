-- Supabase schema for ai-vocabulary-review
-- Run in Supabase SQL editor before deploying the Next.js app

-- UUID generator (needed for gen_random_uuid())
create extension if not exists pgcrypto;

-- Words table
create table if not exists public.words (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  word text not null,
  chinese_meaning text not null,
  english_meaning text,
  phonetic text,
  example_sentence text,
  synonyms text[],
  antonyms text[],
  is_difficult boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security
alter table public.words enable row level security;

-- Policies: drop-if-exists then create (Postgres doesn't support IF NOT EXISTS here)
drop policy if exists "Enable read for own words" on public.words;
create policy "Enable read for own words"
  on public.words for select
  using (auth.uid() = user_id);

drop policy if exists "Enable insert for authenticated users" on public.words;
create policy "Enable insert for authenticated users"
  on public.words for insert
  with check (auth.uid() = user_id);

drop policy if exists "Enable update for own words" on public.words;
create policy "Enable update for own words"
  on public.words for update
  using (auth.uid() = user_id);

drop policy if exists "Enable delete for own words" on public.words;
create policy "Enable delete for own words"
  on public.words for delete
  using (auth.uid() = user_id);

-- Uniqueness per user: each user can't duplicate the same word
create unique index if not exists words_user_word_uidx on public.words(user_id, word);

-- Trigger to auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists words_set_updated_at on public.words;
create trigger words_set_updated_at
before update on public.words
for each row execute function public.set_updated_at();
