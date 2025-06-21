"use client"; // Importando o modo "client" para usar hooks do React

import { useEffect, useState } from "react"; // Importando useState e useEffect do React

export default function Home() {
  const [tarefa, setTask] = useState("");

  type Tarefa = { // Definindo o tipo Tarefa
    id: number;
    texto: string;
    feita: boolean;
    editando?: boolean;
  };

  const [filtro, setFiltro] = useState("todas"); // Estado para o filtro de tarefas

  const [tarefas, setTasks] = useState<Tarefa[]>([ // Estado para armazenar as tarefas
    { id: 1, texto: "alguma coisa", feita: false },
    { id: 2, texto: "alguma coisa aqui", feita: true },
  ]);

  const tarefasFiltradas = tarefas.filter((tarefa) => { // Filtrando as tarefas com base no estado do filtro
    if (filtro === "completas") return tarefa.feita;
    if (filtro === "incompletas") return !tarefa.feita;
    return true; // todas
  });

  useEffect(() => {
    const tarefasSalvas = localStorage.getItem("tarefas"); // Recuperando as tarefas salvas do localStorage
    if (tarefasSalvas) {
      setTasks(JSON.parse(tarefasSalvas)); // Convertendo a string JSON de volta para um array de tarefas
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tarefas", JSON.stringify(tarefas)); // Salvando as tarefas no localStorage sempre que elas mudam
  }, [tarefas]);

  function handleAddTask() { // Função para adicionar uma nova tarefa
    if (!tarefa.trim()) return;
    const novaTarefa: Tarefa = {
      id: Date.now(),
      texto: tarefa,
      feita: false,
    };
    setTasks([...tarefas, novaTarefa]); // Adiciona a nova tarefa ao estado
    setTask("");
  }

  function alternarTarefa(index: number) { // Função para alternar o estado de uma tarefa (feita ou não feita)
    const novasTarefas = [...tarefas];
    novasTarefas[index].feita = !novasTarefas[index].feita; // Inverte o estado da tarefa
    setTasks(novasTarefas);
  }

  function ativarEdicao(index: number) { // Função para ativar o modo de edição de uma tarefa
    const novasTarefas = [...tarefas];
    novasTarefas[index].editando = true;
    setTasks(novasTarefas);
  }

  function salvarEdicao(index: number, novoTexto: string) { // Função para salvar a edição de uma tarefa
    const novasTarefas = [...tarefas];
    novasTarefas[index].texto = novoTexto;
    novasTarefas[index].editando = false;
    setTasks(novasTarefas);
  }

  function deletarTarefa(index: number) {
    const novasTarefas = tarefas.filter((_, i) => i !== index); // Função para deletar uma tarefa
    setTasks(novasTarefas);
  }

  return (
    <main>
      <h1>Todo-List Whatsmenu</h1>
      <input
        type="text"
        placeholder="O que eu preciso fazer?"
        value={tarefa} // Estado controlado para o input de tarefa
        onChange={(e) => setTask(e.target.value)} // Atualiza o estado da tarefa conforme o usuário digita
      />
      <button onClick={handleAddTask}>Adicionar</button>

      <div className="filtro" >
        <button onClick={() => setFiltro("todas")}>Todas</button>
        <button onClick={() => setFiltro("completas")}>Completas</button>
        <button onClick={() => setFiltro("incompletas")}>Incompletas</button>
      </div>

      <ul>
        {tarefasFiltradas.map((t, index) => ( // Mapeando as tarefas filtradas para exibição
          <li key={t.id}>
            <input
              type="checkbox"
              checked={t.feita}
              onChange={() => alternarTarefa(index)} // Alterna o estado da tarefa ao marcar/desmarcar a checkbox
            />
            {t.editando ? (
              <input
                type="text"
                defaultValue={t.texto}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    salvarEdicao(index, (e.target as HTMLInputElement).value); // Salva a edição ao pressionar Enter
                  }
                }}
              />
            ) : (
              <span
                className={t.feita ? "feita" : ""}
                onDoubleClick={() => ativarEdicao(index)} // Ativa o modo de edição ao dar duplo clique
                style={{
                  marginLeft: "8px",
                  cursor: "pointer",
                  flex: 1,
                  textDecoration: t.feita ? "line-through" : "none", 
                }}
              >
                {t.texto}
              </span>
            )}
            <button onClick={() => deletarTarefa(index)}>🗑️</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
