# Trabalho da disciplina de Marcações Extensíveis

Repositório destinado ao trabalho final da disciplina de Linguagem de Marcação Extensível

## Aluno

* **[Vinicius Dutra](https://github.com/vfdutra)**.

## Configuração
### Pré-requisitos

O trabalho desenvolvido utiliza as seguintes ferramentas:
   * A plataforma, construída sobre o JavaScript, [Node.js](https://nodejs.org/en/);
   * Um gerenciador de pacotes para Javascript: [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
   </br>Obs.: No desenvolvimento foi utilizado o NPM como gerenciador.

### Instalação
Com ambas as ferramentas instaladas, é necessário que todas as dependências do projeto sejam instaladas. Basta executar o comando abaixo dentro da raiz do projeto.
```bash
$ npm install
# yarn
```

Terminado o processo de configuração das dependências do projeto, basta executar o comando referente a parte desejada:
```bash
# Validaçôes 
$ node validation.js

# Consultas
$ node consultas.js

# Transformação do documento XML.
$ node index.js
```
### Validação
A biblioteca das validações depende apenas dos arquivos arquvio.dtd e arquivo.xsd (além do arquivo.xml padrão), pois ela roda apenas as funções que verificam que o arquivo é valido, caso algum erro ocorra, será exibido no console, caso contrário, uma mensagem de sucesso aparecerá para cada caso.

### Consultas
Uma pasta com o nome consultas será preenchida com páginas HTML para cada consulta necessária.

### Transformação 
Várias pastas serão preenchidas com arquivos HTML referentes a cada topic e associations do arquivo XML