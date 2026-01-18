<template>
  <q-page class="q-pa-md">
    <q-form
      ref="formPessoa"
      greedy
      @submit.prevent="salvar"
    >
      <div class="main-container">

        <!-- Título -->
        <div class="q-mb-md">
          <h4 class="title">{{ pessoa.id ? 'Editar ' : 'Cadastrar ' }} Pessoas</h4>
          <div class="divisor-inline"></div>
        </div>

        <!-- Dados Básicos -->
        <div class="q-pa-md">
          <h4 class="subTitulo">Dados Básicos</h4>

          <div class="row q-col-gutter-lg q-mb-sm">
            <div class="col-7">
              <q-input
                v-model="pessoa.nome"
                label="Nome"
                dense
                :rules="[required]"
              />
            </div>

            <div class="col-2">
              <q-input
                v-model="pessoa.documento"
                label="Documento"
                dense
                :rules="[required]"
              />
            </div>

            <div class="col-3">
              <q-input
                v-model="pessoa.profissao"
                label="Profissão"
                dense
                :rules="[required]"
              />
            </div>

            <div class="col-6">
              <q-field
                dense
                label="Tipo Pessoa"
                borderless
                stack-label
                :error="!requiredOption(pessoa.tipo)"
                error-message="Campo obrigatório"              
               >
                <q-option-group
                  v-model="pessoa.tipo"
                  :options="optionsTipoPessoa"
                  inline
                />
              </q-field>              
            </div>
            <div class="col-6">
              <q-field
                dense
                label="Estado Civil"
                borderless
                stack-label
                :error="!requiredOption(pessoa.estadoCivil)"
                error-message="Campo obrigatório"              
               >
                <q-option-group
                  v-model="pessoa.estadoCivil"
                  :options="optionsEstadoCivil"
                  inline
                />
              </q-field>              
            </div>
          </div>
        </div>

        <!-- Endereço -->
        <div class="q-pa-md">
          <h4 class="subTitulo">Endereço</h4>

          <div class="row q-col-gutter-lg q-mb-sm">
            <div class="col-2">
              <q-input
                v-model="pessoa.endereco.cep"
                label="CEP"
                dense
                :rules="[required]"
              />
            </div>

            <div class="col-8">
              <q-input
                v-model="pessoa.endereco.rua"
                label="Rua"
                dense
                :rules="[required]"
              />
            </div>

            <div class="col-2">
              <q-input
                v-model="pessoa.endereco.numero"
                label="Número"
                dense
                :rules="[required]"
              />
            </div>

            <div class="col-4">
              <q-input
                v-model="pessoa.endereco.bairro"
                label="Bairro"
                dense
                :rules="[required]"
              />
            </div>

            <div class="col-3">
              <q-input
                v-model="pessoa.endereco.estado"
                label="Estado"
                dense
                :rules="[required]"
              />
            </div>

            <div class="col-4">
              <q-input
                v-model="pessoa.endereco.cidade"
                label="Cidade"
                dense
                :rules="[required]"
              />
            </div>
          </div>
        </div>

        <!-- Botões -->
        <div class="row">
          <div class="col-12">
            <div class="float-right">
              <q-btn
                label="Voltar"
                no-caps
                class="btn-voltar q-mr-sm"
                flat
                @click="voltar"
              />
              <q-btn
                type="submit"
                :label="pessoa.id ? 'Salvar' : 'Cadastrar'"
                no-caps
                color="primary"
                class="btn-cadastrar"
              />
            </div>
          </div>
        </div>

      </div>
    </q-form>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { pessoaService } from 'src/services/sgci-api-service'
import { required, requiredOption } from 'src/utils/validators'
import { useRoute, useRouter } from 'vue-router'
import { Notify } from 'quasar'


export default {
  name: 'CreateEditPessoa',

  setup () {
    const formPessoa = ref(null)
    const route = useRoute()
    const router = useRouter()

    const pessoa = ref({
      id: null,
      nome: null,
      documento: null,
      profissao: null,
      tipo: null,
      estadoCivil: null,
      endereco: {
        cep: null,
        estado: null,
        cidade: null,
        rua: null,
        bairro: null,
        numero: null
      }
    })

    function normalizarPessoa (data) {
      return {
        id: data?.id ?? null,
        nome: data?.nome ?? null,
        documento: data?.documento ?? null,
        profissao: data?.profissao ?? null,
        tipo: data?.tipo ?? null,
        estadoCivil: data?.estadoCivil ?? null,
        endereco: {
          cep: data?.endereco?.cep ?? null,
          estado: data?.endereco?.estado ?? null,
          cidade: data?.endereco?.cidade ?? null,
          rua: data?.endereco?.rua ?? null,
          bairro: data?.endereco?.bairro ?? null,
          numero: data?.endereco?.numero ?? null
        }
      }
    }     
    
    async function salvar () {
      const valido = await formPessoa.value.validate()
      if (!valido) return      

      try {
        if (pessoa.value.id) {
          // 🔄 EDIÇÃO
          await pessoaService.update(pessoa.value.id, pessoa.value)
          Notify.create({
            type: 'positive', // verde padrão do Quasar
            message: 'Pessoa atualizada com sucesso',
            color: 'positive', // fundo verde
            textColor: 'white', // texto branco
            position: 'top-right',
            timeout: 3000
          })          
        } else {
          // ➕ CADASTRO
          await pessoaService.create(pessoa.value)
          Notify.create({
            type: 'positive', // verde padrão do Quasar
            message: 'Pessoa cadastrada com sucesso',
            color: 'positive', // fundo verde
            textColor: 'white', // texto branco
            position: 'top-right',
            timeout: 3000
          })          
        }
      } catch (error) {
          Notify.create({
            type: 'negative',
            message: 'Erro ao cadastrar/atualizar pessoa: '+error,
            position: 'top-right'
          })        
      }
    }

    async function buscarPessoaParaEdicao () {
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

    onMounted(() => {
      buscarPessoaParaEdicao()
    })

    return {
      formPessoa,
      pessoa,
      buscarPessoaParaEdicao,
      required,
      requiredOption,
      optionsTipoPessoa: [
        { label: 'Pessoa Física', value: 'PESSOA_FISICA' },
        { label: 'Pessoa Jurídica', value: 'PESSOA_JURIDICA' }
      ],
      optionsEstadoCivil: [
        { label: 'Casado', value: 'CASADO' },
        { label: 'Solteiro', value: 'SOLTEIRO' },
        { label: 'Divorciado', value: 'DIVORCIADO' }
      ],
      salvar,
      voltar
    }
  }
}
</script>
