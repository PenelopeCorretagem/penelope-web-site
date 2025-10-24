import { FormModel } from '@shared/components/ui/Form/FormModel'

/**
 * ManagementFormModel - Modelo de dados para formulários de gerenciamento
 * Herda de FormModel e mantém a mesma interface, permitindo override de comportamentos
 */
export class ManagementFormModel extends FormModel {
  constructor(props = {}) {
    super(props)
  }

  // Override de métodos para personalização se necessário
  // Por enquanto mantém comportamento base do FormModel
}
