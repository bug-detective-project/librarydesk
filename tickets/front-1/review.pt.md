# Code review: LD-101, um estado que devia ser uma conta

A página tinha os exemplares certos; um número era cópia de uma resposta antiga. Aqui está a abordagem de referência, para você comparar com a sua.

## Por que o bug aconteceu

- O `useState(inicial)` usa o `inicial` uma vez, quando o componente aparece. Ele serve para valores que o próprio componente muda, não para valores que seguem as props.
- Depois de um empréstimo, a página do livro recarrega o livro e passa os exemplares novos para baixo. O `Availability` é o mesmo componente na tela, então guarda o estado.
- As barrinhas eram calculadas a partir da prop, por isso estavam certas e deixavam o bug estranho.

## Por que o conserto de referência está certo

- O número é derivado de `copies` durante a renderização, como as barrinhas: uma fonte só, sempre em dia.
- Filtrar alguns exemplares a cada renderização não custa nada; não há o que guardar em cache.
- O componente fica sem estado, que é uma coisa a menos para manter em sincronia.

## Compare com o seu conserto

- Você acrescentou um `useEffect` que chama `setAvailable` quando `copies` muda? Funciona, com uma renderização a mais que primeiro pinta o número antigo e depois o novo; a documentação do React chama isso de "talvez você não precise de um efeito".
- Você pôs uma `key` no `<Availability>` que muda com os exemplares? Ela força um componente novo e, com ele, um estado novo; esconde o problema em vez de tirá-lo.
- Você leu o `book.available` da API? Também está certo: a API já manda esse valor. De qualquer jeito, o número precisa vir dos dados desta renderização.
