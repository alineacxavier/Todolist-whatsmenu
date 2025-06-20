"use client"; // Para rodar no navegador

import { useEffect, useState } from "react"; // gerenciar estado e efeitos

export default function Home() {
  // Criar os componentes da página inicial(e unica) hehe

  const [tarefa, setTask] = useState(""); // useState é usado para criar tarefas enquanto (aqui vamos guardar o texto do input)

  type Tarefa = {
    // definindo o tipo Tarefa
    texto: string;
    feita: boolean;
    editando?: boolean; //
  };

  const [tarefas, setTasks] = useState<Tarefa[]>([]); // useState é usado para criar uma lista de tarefas ( objetos com texto e status de conclusão)

  // tarefas salvas
  useEffect(() => {
    const tarefasSalvas = localStorage.getItem("tarefas");
    if (tarefasSalvas) {
      setTasks(JSON.parse(tarefasSalvas));
    }
  }, []);

  // Salva tarefas sempre 
  useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  function handleAddTask() {
    // Função para adicionar uma nova tarefa
    setTasks([...tarefas, { texto: tarefa, feita: false }]);
    setTask(""); // limpa o campo
  }

  function alternarTarefa(index: number) {
    const novasTarefas = [...tarefas];
    novasTarefas[index].feita = !novasTarefas[index].feita;
    setTasks(novasTarefas);
  }
  function ativarEdicao(index: number) {
    const novasTarefas = [...tarefas];
    novasTarefas[index].editando = true; // Marca a tarefa como editando
    setTasks(novasTarefas);
  }
  function salvarEdicao(index: number, novoTexto: string) {
    const novasTarefas = [...tarefas];
    novasTarefas[index].texto = novoTexto;
    novasTarefas[index].editando = false;
    setTasks(novasTarefas);
  }
  function deletarTarefa(index: number) {
    const novasTarefas = tarefas.filter((_, i) => i !== index); // filtra as tarefas para remover
    setTasks(novasTarefas);
  }

  return (
    <main>
      <h1>Todo-List Whastmenu</h1>
      <input
        type="text"
        placeholder="O que eu preciso fazer?"
        value={tarefa} // O valor do input é controlado pelo estado tarefa
        onChange={(e) => setTask(e.target.value)} // Atualiza o estado da tarefa quando o input muda
      />
      <button onClick={handleAddTask}>Adicionar</button>{" "}
      {/* Botão para adicionar a tarefa */}
      <ul>
        {tarefas.map(
          (
            t,
            index // Mapeia as tarefas e cria um item de lista para cada uma
          ) => (
            <li key={index}>
              <input
                type="checkbox" // Checkbox para marcar a tarefa como feita
                checked={t.feita}
                onChange={() => alternarTarefa(index)}
              />

              {t.editando ? (
                <input
                  type="text"
                  defaultValue={t.texto}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      salvarEdicao(index, (e.target as HTMLInputElement).value); // Salva a edição quando apertar Enter
                    }
                  }}
                />
              ) : (
                <span
                  className={t.feita ? "feita" : ""}
                  onDoubleClick={() => ativarEdicao(index)}
                  style={{ marginLeft: "8px", cursor: "pointer", flex: 1 }} // edita a tarefa ao dar um duplo clique
                >
                  {t.texto}
                </span>
              )}
              <button
                className="botao-excluir"
                onClick={() => deletarTarefa(index)}
              >
                🗑️
              </button>
            </li>
          )
        )}
      </ul>
    </main>
  );
}
