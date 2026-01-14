<template>
  <q-page class="q-pa-md">

    <q-form greedy ref="formPessoa" @submit.prevent="cadastrar">
      <div class="bg"></div>
      <div class="main-container">
        <div class="q-mb-md">
            <h4>Cadastrar Pessoas</h4>
            <div class="divisor-inline"></div>
        </div>
        <div class="q-pa-md">
            <h4 class="subTitulo">Dados Básicos</h4>
            <div class="row q-col-gutter-lg q-mb-sm">
                <div class="col-7">
                    <q-input :rules="[ val => !(val == null || val == '') || 'Campo Obrigatório']" v-model="pessoa.nome" label="Nome"  dense/>
                </div>
                <div class="col-2">
                    <q-input :rules="[ val => !(val == null || val == '') || 'Campo Obrigatório']" v-model="pessoa.documento" label="Documento"  dense/>
                </div>
                <div class="col-3">
                    <q-input :rules="[ val => !(val == null || val == '') || 'Campo Obrigatório']" v-model="pessoa.profissao" label="Profissão"  dense/>
                </div>
                <div class="col-6">
                <q-field dense label="Tipo Pessoa" lazy-rules borderless stack-label>    
                    <q-option-group v-model="pessoa.tipo" :options="optionsTipoPessoa" color="primary" inline/>
                </q-field>    
                </div>                
                <div class="col-6">
                <q-field dense label="Estado Civil" lazy-rules borderless stack-label>    
                    <q-option-group v-model="pessoa.estadoCivil" :options="optionsEstadoCivil" color="primary" inline/>
                </q-field>    
                </div>                
            </div>
            <!--campos-->
        </div>
        <div class="q-pa-md">
            <h4 class="subTitulo">Endereço</h4>
            <div class="row q-col-gutter-lg q-mb-sm">
                <div class="col-2">
                    <q-input :rules="[ val => !(val == null || val == '') || 'Campo Obrigatório']" v-model="pessoa.endereco.cep" label="CEP"  dense/>
                </div>
                <div class="col-8">
                    <q-input :rules="[ val => !(val == null || val == '') || 'Campo Obrigatório']" v-model="pessoa.endereco.rua" label="Rua"  dense/>
                </div>
                <div class="col-2">
                    <q-input :rules="[ val => !(val == null || val == '') || 'Campo Obrigatório']" v-model="pessoa.endereco.numero" label="Número"  dense/>
                </div>
                <div class="col-4">
                    <q-input :rules="[ val => !(val == null || val == '') || 'Campo Obrigatório']" v-model="pessoa.endereco.bairro" label="Bairro"  dense/>
                </div>
                <div class="col-3">
                    <q-input :rules="[ val => !(val == null || val == '') || 'Campo Obrigatório']" v-model="pessoa.endereco.estado" label="Estado"  dense/>
                </div>
                <div class="col-4">
                    <q-input :rules="[ val => !(val == null || val == '') || 'Campo Obrigatório']" v-model="pessoa.endereco.cidade" label="Cidade"  dense/>
                </div>
            </div>
            <!--campos-->
        </div>
        <div class="row">
            <div class="col-12">
                <div style="float: right">
                    <q-btn style="margin-right: 10px;" label="Voltar" no-caps class="btn-voltar" />
                    <q-btn type="submit" label="Cadastrar" no-caps class="btn-cadastrar" />
                </div>
            </div>
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { pessoaService } from 'src/services/sgci-api-service.js'

export default {
  name: 'CreateEditPessoa',

  setup () {
    const pessoa = ref({
      nome: null,
      documento: null,
      profissao: null,
      tipo: null,
      estadoCivil: null,
      endereco: ref({
        cep: null,
        estado: null,
        cidade: null,
        rua: null,
        bairro: null,
        numero: null
      })
    })

    function cadastrar () {
        console.log('Enviando pessoa:', pessoa.value)

        pessoaService.create(pessoa.value)
        .then(response => {
            console.log('Pessoa cadastrada com sucesso!')
            console.log(response.data)
        })
        .catch(error => {
            console.error('Erro ao cadastrar', error)
        })    
    }

    return {
      pessoa,
      optionsTipoPessoa: [
        {
          label: 'Pessoa Física',
          value: 'PESSOA_FISICA'
        },
        {
          label: 'Pessoa Jurídica',
          value: 'PESSOA_JURIDICA'
        }
      ],      
      optionsEstadoCivil: [
        {
          label: 'Casado',
          value: 'CASADO'
        },
        {
          label: 'Solteiro',
          value: 'SOLTEIRO'
        },
        {
          label: 'Divorciado',
          value: 'DIVORCIADO'
        }
      ],      
      cadastrar
    }
  }
}
</script>