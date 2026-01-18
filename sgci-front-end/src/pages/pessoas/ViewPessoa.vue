<template>
  <q-page class="q-pa-md">
    <div class="main-container">

      <!-- Título -->
      <div class="q-mb-md">
        <h4 class="title">Visualizar Pessoa</h4>
        <div class="divisor-inline"></div>
      </div>

      <!-- Dados Básicos -->
      <div class="q-pa-md">
        <h4 class="subTitulo">Dados Básicos</h4>

        <div class="row q-col-gutter-lg q-mb-sm">
          <div class="col-7 campo-view">
            <div class="view-field">
              <span class="label-view">Nome</span>
              <span class="value-view">{{ pessoa.nome }}</span>
            </div>
          </div>

          <div class="col-2 campo-view">
            <div class="view-field">
              <span class="label-view">Documento</span>
              <span class="value-view">{{ pessoa.documento }}</span>
            </div>
          </div>

          <div class="col-3 campo-view">
            <div class="view-field">
              <span class="label-view">Profissão</span>
              <span class="value-view">{{ pessoa.profissao }}</span>
            </div>
          </div>

          <div class="col-6 campo-view">
            <div class="view-field">
              <span class="label-view">Tipo Pessoa</span>
              <span class="value-view">{{ TIPO_PESSOA_LABEL[pessoa.tipo] || '-' }}</span>
            </div>
          </div>

          <div class="col-6 campo-view">
            <div class="view-field">
              <span class="label-view">Estado Civil</span>
              <span class="value-view">{{ ESTADO_CIVIL_LABEL[pessoa.estadoCivil] || '-' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Endereço -->
      <div class="q-pa-md">
        <h4 class="subTitulo">Endereço</h4>

        <div class="row q-col-gutter-lg q-mb-sm">
          <div class="col-2 campo-view">
            <div class="view-field">
              <span class="label-view">CEP</span>
              <span class="value-view">{{ pessoa.endereco.cep }}</span>
            </div>
          </div>

          <div class="col-8 campo-view">
            <div class="view-field">
              <span class="label-view">Rua</span>
              <span class="value-view">{{ pessoa.endereco.rua }}</span>
            </div>
          </div>

          <div class="col-2 campo-view">
            <div class="view-field">
              <span class="label-view">Número</span>
              <span class="value-view">{{ pessoa.endereco.numero }}</span>
            </div>
          </div>

          <div class="col-4 campo-view">
            <div class="view-field">
              <span class="label-view">Bairro</span>
              <span class="value-view">{{ pessoa.endereco.bairro }}</span>
            </div>
          </div>

          <div class="col-3 campo-view">
            <div class="view-field">
              <span class="label-view">Estado</span>
              <span class="value-view">{{ pessoa.endereco.estado }}</span>
            </div>
          </div>

          <div class="col-4 campo-view">
            <div class="view-field">
              <span class="label-view">Cidade</span>
              <span class="value-view">{{ pessoa.endereco.cidade }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Botão -->
      <div class="row">
        <div class="col-12">
          <div class="float-right">
            <q-btn
              label="Voltar"
              no-caps
              class="btn-voltar"
              flat
              @click="voltar"
            />
          </div>
        </div>
      </div>

    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { pessoaService } from 'src/services/sgci-api-service'
import { useRoute, useRouter } from 'vue-router'
import {
  TIPO_PESSOA_LABEL,
  ESTADO_CIVIL_LABEL
} from 'src/utils/enum-labels'

export default {
  name: 'ViewPessoa',

  setup () {
    const route = useRoute()
    const router = useRouter()

    const pessoa = ref({
      nome: '',
      documento: '',
      profissao: '',
      tipo: '',
      estadoCivil: '',
      endereco: {
        cep: '',
        estado: '',
        cidade: '',
        rua: '',
        bairro: '',
        numero: ''
      }
    })

    function normalizarPessoa (data) {
      return {
        nome: data?.nome ?? '',
        documento: data?.documento ?? '',
        profissao: data?.profissao ?? '',
        tipo: data?.tipo ?? '',
        estadoCivil: data?.estadoCivil ?? '',
        endereco: {
          cep: data?.endereco?.cep ?? '',
          estado: data?.endereco?.estado ?? '',
          cidade: data?.endereco?.cidade ?? '',
          rua: data?.endereco?.rua ?? '',
          bairro: data?.endereco?.bairro ?? '',
          numero: data?.endereco?.numero ?? ''
        }
      }
    }

    async function buscarPessoa () {
      const id = route.params.id
      if (!id) return

      try {
        const response = await pessoaService.findById(id)
        pessoa.value = normalizarPessoa(response.data)
      } catch (error) {
        console.error('Erro ao buscar pessoa', error)
      }
    }

    function voltar () {
      router.push({ name: 'GridPessoa' })
    }

    onMounted(buscarPessoa)

    return {
      pessoa,
      TIPO_PESSOA_LABEL,
      ESTADO_CIVIL_LABEL,
      voltar      
    }
  }
}
</script>
