document.addEventListener('DOMContentLoaded', () => {
    const adicionarButton = document.getElementById('adicionar');
    const tituloInput = document.getElementById('titulo');
    const descricaoInput = document.getElementById('descricao');
    const listaTarefas = document.getElementById('lista-tarefas');

    // Carregar tarefas do armazenamento local
    chrome.storage.local.get(['tarefas'], (resultado) => {
        if (resultado.tarefas) {
            resultado.tarefas.forEach(tarefa => adicionarTarefaNaLista(tarefa));
        }
    });

    // Adicionar nova tarefa
    adicionarButton.addEventListener('click', () => {
        const titulo = tituloInput.value;
        const descricao = descricaoInput.value;

        if (titulo) {
            const novaTarefa = { titulo, descricao, concluida: false };
            adicionarTarefaNaLista(novaTarefa);
            salvarTarefa(novaTarefa);
            tituloInput.value = '';
            descricaoInput.value = '';
        }
    });

    // Função para adicionar tarefa na lista
    function adicionarTarefaNaLista(tarefa) {
        const li = document.createElement('li');
        li.textContent = `${tarefa.titulo}: ${tarefa.descricao}`;
        if (tarefa.concluida) {
            li.classList.add('concluida');
        }
        
        // Botão para remover tarefa
        const removerButton = document.createElement('button');
        removerButton.textContent = 'Remover';
        removerButton.addEventListener('click', () => {
            li.remove();
            removerTarefa(tarefa);
        });
        
        // Botão para marcar como concluída
        const concluirButton = document.createElement('button');
        concluirButton.textContent = tarefa.concluida ? 'Desmarcar' : 'Concluir';
        concluirButton.addEventListener('click', () => {
            tarefa.concluida = !tarefa.concluida;
            li.classList.toggle('concluida');
            concluirButton.textContent = tarefa.concluida ? 'Desmarcar' : 'Concluir';
            atualizarTarefas();
        });

        li.appendChild(concluirButton);
        li.appendChild(removerButton);
        listaTarefas.appendChild(li);
    }

    // Função para salvar tarefa no armazenamento
    function salvarTarefa(tarefa) {
        chrome.storage.local.get(['tarefas'], (resultado) => {
            const tarefas = resultado.tarefas || [];
            tarefas.push(tarefa);
            chrome.storage.local.set({ tarefas });
        });
    }

    // Função para remover tarefa do armazenamento
    function removerTarefa(tarefa) {
        chrome.storage.local.get(['tarefas'], (resultado) => {
            const tarefas = resultado.tarefas || [];
            const novasTarefas = tarefas.filter(t => t.titulo !== tarefa.titulo);
            chrome.storage.local.set({ tarefas: novasTarefas });
        });
    }

    // Atualiza o armazenamento com as tarefas atuais
    function atualizarTarefas() {
        const tarefasAtuais = Array.from(listaTarefas.children).map(li => {
            const texto = li.textContent.split(':')[0];
            return { titulo: texto, descricao: '', concluida: li.classList.contains('concluida') };
        });
        chrome.storage.local.set({ tarefas: tarefasAtuais });
    }
});
