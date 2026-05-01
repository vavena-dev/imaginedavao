-- Section-specific views for easier DB browsing while keeping a shared content table

create or replace view public.v_index as
select * from public.content_blocks
where page = 'index';

create or replace view public.v_things as
select * from public.content_blocks
where page = 'things' or section = 'things';

create or replace view public.v_events as
select * from public.content_blocks
where page = 'events' or section = 'events';

create or replace view public.v_eat as
select * from public.content_blocks
where page = 'eat' or section = 'eat';

create or replace view public.v_stay as
select * from public.content_blocks
where page = 'stay' or section = 'stay';

create or replace view public.v_guides as
select * from public.content_blocks
where page = 'guides' or section = 'guides';
