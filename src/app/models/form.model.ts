import { IAction, IField } from './field.model';

export interface IDynamicForm {
  fields: IField[];
  actions: IAction[];
}
