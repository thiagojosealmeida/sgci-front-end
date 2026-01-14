// 1. IMPORTE A INSTÂNCIA 'api' CORRETA, que já tem a baseURL.
import { api } from 'boot/axios'

// 2. Defina o caminho base para este serviço.
const resourcePath = 'pessoas'

// 3. Exporte um objeto simples com os métodos do serviço.
export const pessoaService = {

  /**
   * Cadastra uma nova pessoa.
   */
  create (pessoa) {
    // Use a instância 'api' importada e o caminho do recurso.
    return api.post(resourcePath, pessoa)
  },

  /**
   * Busca todas as pessoas.
   */
  findAll () {
    return api.get(resourcePath)
  },

  /**
   * Busca uma pessoa por ID.
   */
  findById (id) {
    return api.get(`${resourcePath}/${id}`)
  },

  /**
   * Atualiza uma pessoa.
   */
  update (id, pessoa) {
    return api.put(`${resourcePath}/${id}`, pessoa)
  },

  /**
   * Deleta uma pessoa.
   */
  delete (id) {
    return api.delete(`${resourcePath}/${id}`)
  }
}
