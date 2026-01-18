// Campo obrigatório (inputs, selects, etc)
export const required = (val) =>
  !!val || val === 0 || 'Campo Obrigatório'

// Campo obrigatório para option-group (radio / checkbox)
export const requiredOption = val =>
  !!val