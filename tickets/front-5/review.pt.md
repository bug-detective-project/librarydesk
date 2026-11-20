# Code review: LD-105, uma chave que não dependia do leitor

Carregar dados tem uma pergunta para responder: quando carrego de novo? Aqui a resposta esqueceu o leitor. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- O React Router renderiza a mesma `ReaderPage` para `/readers/1` e `/readers/2`; ir de um para o outro muda um parâmetro, não o componente. O estado e os efeitos ficam.
- O `useResource` recarrega quando a chave muda (a chave é a dependência do efeito dele). A chave dos empréstimos não tinha o id, então para o hook nada tinha mudado.
- Recarregar a página, ou passar pela lista, monta uma `ReaderPage` nova, por isso esses caminhos funcionavam.

## Por que o conserto de referência está certo

- A chave descreve exatamente o que é carregado, os empréstimos **deste leitor**, então um leitor novo é uma chave nova e uma requisição nova.
- O `useResource` aborta a requisição da chave antiga quando a chave muda, então uma resposta lenta da Emma não cai na página do Liam.
- O leitor e os empréstimos agora seguem a mesma regra.

## Compare com o seu conserto

- Você pôs `key={id}` na `<ReaderPage>` da rota? Ela remonta a página a cada leitor: funciona, e joga fora todo estado da página (um diálogo aberto, por exemplo) para esconder uma dependência que faltava.
- Você chamou `loans.reload()` num efeito sobre `id`? Funciona com uma renderização a mais, e a resposta antiga ainda pode chegar depois da nova.
- Você leu o aviso do eslint sobre as dependências de um efeito? É a mesma lição: o que o carregamento usa precisa fazer parte do que o dispara.
