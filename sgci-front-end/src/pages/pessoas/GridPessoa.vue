<template>
  <q-page class="q-pa-md">
    <q-table
      flat
      bordered
      title="Pessoas"
      :rows="rowsFiltradas"
      :columns="columns"
      row-key="id"
      :loading="loading"
      no-data-label="Nenhum registro encontrado"
      rows-per-page-label="Registros por Página"
      :pagination-label="paginationLabel"
      :pagination="{ rowsPerPage: 10 }"
      :rows-per-page-options="[1, 5, 10, 20, 50, 0]"
    >
      <!-- SLOT DO HEADER TEM QUE FICAR AQUI -->
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name">
            <div class="column-header">
              <div class="column-label">{{ col.label }}</div>
              <q-input
                v-if="filtros[col.name] !== undefined"
                v-model="filtros[col.name]"
                dense
                outlined
                debounce="300"
                placeholder="Pesquisar"
              />
            </div>
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body-cell-acoes="props">
        <q-td align="center">
            <q-btn
                flat
                round
                color="primary"
                icon="edit"
                size="sm"
                @click="editarPessoa(props.row.id)"
            >
                <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
                flat
                round
                color="secondary"
                icon="visibility"
                size="sm"
                class="q-ml-sm"
                @click="visualizarPessoa(props.row.id)"
            >
                <q-tooltip>Visualizar</q-tooltip>
            </q-btn>
            <q-btn
                flat
                round
                color="negative"
                icon="delete"
                size="sm"
                @click="confirmarExclusao(props.row.id)"
            >
                <q-tooltip>Excluir</q-tooltip>
            </q-btn>
        </q-td>
      </template>
        <!-- BOTÃO CADASTRAR (ABAIXO DA PAGINAÇÃO) -->
        <template v-slot:bottom>
            <div class="row justify-end q-pa-sm full-width">
            <q-btn
                label="Cadastrar"
                color="primary"
                no-caps
                @click="irParaCadastro"
            />
            </div>
        </template>      
    </q-table>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { pessoaService } from 'src/services/sgci-api-service'
import {
  TIPO_PESSOA_LABEL,
  ESTADO_CIVIL_LABEL
} from 'src/utils/enum-labels'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog } from 'quasar'
import { Notify } from 'quasar'

export default {
  name: 'GridPessoa',

  setup () {
    const loading = ref(false)
    const rows = ref([])

    const columns = [
      {
        name: 'id',
        label: 'Id',
        field: 'id',
        align: 'left',
        sortable: true
      },
      {
        name: 'nome',
        label: 'Nome',
        field: 'nome',
        align: 'left',
        sortable: true
      },
      {
        name: 'documento',
        label: 'Documento',
        field: 'documento',
        align: 'left'
      },
      {
        name: 'profissao',
        label: 'Profissão',
        field: 'profissao',
        align: 'left'
      },
      {
        name: 'tipo',
        label: 'Tipo Pessoa',
        field: row => TIPO_PESSOA_LABEL[row.tipo],
        align: 'left'
      },
      {
        name: 'estadoCivil',
        label: 'Estado Civil',
        field: row => ESTADO_CIVIL_LABEL[row.estadoCivil],
        align: 'left'
      },
      {
        name: 'acoes',
        label: 'Ações',
        align: 'center',
        field: 'acoes'
      }
    ]

    const filtros = ref({
        id: '',
        nome: '',
        documento: '',
        tipo: '',
        profissao: '',
        estadoCivil: ''
    })

    const rowsFiltradas = computed(() => {
        return rows.value.filter(row => {
            return (
            (!filtros.value.id || String(row.id).includes(filtros.value.id)) &&
            (!filtros.value.nome || row.nome?.toLowerCase().includes(filtros.value.nome.toLowerCase())) &&
            (!filtros.value.documento || row.documento?.includes(filtros.value.documento)) &&
            (!filtros.value.tipo || row.tipo?.toLowerCase().includes(filtros.value.tipo.toLowerCase())) &&
            (!filtros.value.profissao || row.profissao?.toLowerCase().includes(filtros.value.profissao.toLowerCase())) &&
            (!filtros.value.estadoCivil || row.estadoCivil?.toLowerCase().includes(filtros.value.estadoCivil.toLowerCase()))
            )
        })
    })

    const router = useRouter()

    function editarPessoa (id) {
        router.push({ name: 'CreateEditPessoa', params: { id } })
    }

    function visualizarPessoa (id) {
        router.push({ name: 'ViewPessoa', params: { id } })
    }

    function irParaCadastro () {
        router.push({ name: 'CreatePessoa' })
    }

    async function buscarPessoas () {
        loading.value = true
        try {
            const response = await pessoaService.findAll()

            rows.value = Array.isArray(response.data)
            ? response.data
            : response.data.data || response.data.content || []

        } catch (error) {
            console.error('Erro ao buscar pessoas', error)
            rows.value = []
        } finally {
            loading.value = false
        }
    }

    async function excluirPessoa (id) {
        try {
          await pessoaService.delete(id)
          await buscarPessoas() // recarrega a tabela
          Notify.create({
            type: 'positive', // verde padrão do Quasar
            message: 'Pessoa excluída com sucesso',
            color: 'positive', // fundo verde
            textColor: 'white', // texto branco
            position: 'top-right',
            timeout: 3000
          })          
        } catch (error) {
            Notify.create({
            type: 'negative',
            message: 'Erro ao excluir pessoa: '+error,
            position: 'top-right'
          })        
        }
    }

    function confirmarExclusao (id) {
      Dialog.create({
        title: 'Confirmar exclusão',
        message: 'Deseja realmente excluir esta pessoa?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        excluirPessoa(id)
      })
    }    

    function paginationLabel (firstRowIndex, lastRowIndex, totalRows) {
        return `${firstRowIndex}-${lastRowIndex} de ${totalRows}`
    }

    onMounted(() => {
      buscarPessoas()
    })

    return {
      columns,
      rows,
      rowsFiltradas,
      filtros,
      loading,
      paginationLabel,
      editarPessoa,
      visualizarPessoa,
      irParaCadastro,
      excluirPessoa,
      confirmarExclusao
    }
  }
}
</script>
