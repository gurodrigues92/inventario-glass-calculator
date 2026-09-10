-- A recuperacao de senha nunca funcionou: password_reset_tokens.user_id apontava para
-- auth.users, mas os usuarios do produto vivem em inventario_glass.usuarios (auth custom).
-- Todo insert de token quebrava na FK, e a tabela estava vazia em 10/09/2026.
alter table inventario_glass.password_reset_tokens
  drop constraint password_reset_tokens_user_id_fkey;

alter table inventario_glass.password_reset_tokens
  add constraint password_reset_tokens_user_id_fkey
  foreign key (user_id) references inventario_glass.usuarios(id) on delete cascade;
