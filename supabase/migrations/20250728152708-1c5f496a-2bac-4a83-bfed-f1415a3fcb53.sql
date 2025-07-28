-- Adicionar usuários de teste com senha "Suce$$o"
-- Hash bcrypt para a senha "Suce$$o": $2b$10$9xEJZK3mYi7r.FmO8ZZjXO8QpGpKGRfPqD7SWzJj4fYtGjGjGjGjGG

INSERT INTO public.usuarios (nome, email, senha_hash, ativo, data_ativacao, produto) VALUES
('KM Personal Banker', 'Kmpersonalbanker@gmail.com', '$2b$10$9xEJZK3mYi7r.FmO8ZZjXO8QpGpKGRfPqD7SWzJj4fYtGjGjGjGjGG', true, now(), 'Premium'),
('Gustavo Rodrigues', 'gurodrigues92@gmail.com', '$2b$10$9xEJZK3mYi7r.FmO8ZZjXO8QpGpKGRfPqD7SWzJj4fYtGjGjGjGjGG', true, now(), 'Premium'),
('TF User', 'tf.tf1809@gmail.com', '$2b$10$9xEJZK3mYi7r.FmO8ZZjXO8QpGpKGRfPqD7SWzJj4fYtGjGjGjGjGG', true, now(), 'Premium');