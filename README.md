# Dependências

1. Baixar PHP; Composer; Git; Node; PostgreSQL
2. As coloque nas variáveis de ambiente do sistema
3. No arquivo php.ini, ative as extensões zip, pdo_pgsql, pgsql e fileinfo
4. Baixe o Laravel pelo CMD com o comando 'composer require laravel/installer'

# Para rodar na sua máquina:
## No computador

    1. Crie uma regra de entrada no Firewall para a porta 5432 (Default do postgre)
    2. Dentro do pgAdmin4, crie um banco, um usuário e uma senha para gerenciar o banco de dados (ou use o padrão)

## Dentro do VSCode
    1. Clone o repositório
    2. Na pasta APP, rode o comando 'npm install' | Na pasta API, rode o comando 'composer install'

## Dentro do VSCode 1.1 -> Crie/Configure o .env
    1. Crie uma app key com o comando 'php artisan key:generate'
    2. Modele o arquivo para funcionar com PostgreSQL
    3. Coloque esta linha ao final -> VITE_APP_NAME="${APP_NAME}"

## Dentro do VSCode 1.2 -> Ligar a aplicação
    1. Na pasta APP, rode o comando 'npm run dev'
    2. Na pasta API, rode o comando 'php artisan serve'
    3. Abra o Site

## No computador 1.1 -> Criando perfil de Admin
    1. Após registrar um perfil através do Site, pelo pgAdmin 4, troque o campo 'tipo' na tabela de usuários de 'aluno', para 'adm' para usar outras funcionalidades da aplicação




