# Dependências para rodar no seu dispositivo windows

1. Baixar PHP; Composer; Git; Node; PostgreSQL

2. adicionar nova regra de entrada no windows defender firewall
        -> crie uma regra do tipo porta e insira a porta 5432(padrão do postgre)
3. Nas variáveis do ambiente, procure por path e adicione duas novas variáveis e cole o caminho para o composer na primeira e do postgre na segunda (geralmente C:\ProgramData\ComposerSetup\bin para o composer e, C:\Program Files\PostgreSQLz17\bin para o postgre)

4. Abra o arquivo php.ini pelo bloco de notas e retire o ";" antes das extensões zip, pdo_pgsql, pgsql e fileinfo

5. com o composer já instalado baixe o Laravel pelo CMD com o comando 'composer require laravel/installer'

5. Abra o app pgAdmin4 e crie um usuário com nome e senha de sua preferência clicando com o botão direito do mouse em "login/group roles"( clique na aba security para definir a senha e na aba Privileges e selecione as opções "canlogin?" e "superuser?")

7. Ainda no pgAdmin4, crie um banco com nome de sua preferencia e selecione o usuário oque vc criou com "owner"(proprietário/dono)

8. caso já tenha o Visual Studio code instalado utilize ctrl+j e use o comando git clone + link do repositório no github(para obte-lo, clique no botão verde escrito "<>code" e copie o link fornecido)

9. agora você já tem tudo o que precisa para rodar o programa em seu dispositvo windows

# Rodando na sua máquina:
## No computador

1. Abra o app pgAdmin4 e crie um usuário com nome e senha de sua preferência clicando com o botão direito do mouse em "login/group roles"( clique na aba security para definir a senha e na aba Privileges e selecione as opções "canlogin?" e "superuser?")
2. Ainda no pgAdmin4, crie um banco com nome de sua preferencia e selecione o usuári oque vc criou com "owner"(proprietário/dono)

## Dentro do VSCode(já com o programa clonado)

1. Clique uma vez em API na parte esquerda e verifique se existe um arquivo chamado .env, caso não exista clique com o botão direito em API e depois clique em new file (novo arquivo) e coloque o nome de ".env". Após isso, edite o arquivo conforme especificações da internet, com opor exemplo:

        # .env - Exemplo de Variáveis de Ambiente

        # Configurações da aplicação
        APP_NAME=Minha Aplicação
        PORT=3000

        # Configurações do banco de dados
        DB_HOST=localhost
        DB_PORT=5432
        DB_USER=root
        DB_PASS=minhasenhasecreta
        DB_DATABASE=sucos

        # Chaves de API
        API_KEY=aqui_vai_sua_chave_de_api_secreta
        NODE_ENV=development
        
2. utilize ctrl+j para abrir o terminal e cooque a seguinte série de comandos:
        1-cd api
        2-php artisan serve
3. após isso clique o simbolo "+" no parte superior direita do terminal para abrir mais um terminal e coloque os seguintes comandos:
        1-cd app
        2-npm run dev
4. no terminal que utilizou o comando "cd app" segure ctrl e clique com o botão esquerdo em ciam do link gerado após o comando run dev

## No computador -> Criando perfil de Admin
1. Após registrar um perfil através do Site, abra o app pgadmin4
2. clique no banco de dados criado por você e abra schemas>public>tables
3. clique com o botão direito na tabela com o nom "users" e depois "view/edit data">"all rolls" que irá abrir uma tabela no canto inferio direito
4. navegando pela tabela procure o usuário que você deseja tranformar em admnistrador
5. encontrando o usuário, procure pela coluna "tipo" e troque "aluno" por "adm"