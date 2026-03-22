create table if not exists audit_results (
  id           uuid        default gen_random_uuid() primary key,
  name         text,
  email        text        not null,
  answers      jsonb,
  cat_scores   jsonb,
  total_score  integer,
  tier_label   text,
  tier_insight text,
  priority_idx integer,
  created_at   timestamptz default now()
);
