export interface IField {
  type: string;
  label: string;
  name: string;
  validations: IValidation[];
  placeholder?: string;
  value?: string;
  options?: IOption[];
  multiple?: boolean;
  inline?: boolean;
  edit?: boolean;
}

export enum ActionTypes {
  submit = 'submit',
  cancel = 'cancel',
}

export interface IAction {
  type: ActionTypes;
  text: string;
}

export interface IOption {
  label: string;
  value: string;
  selected?: boolean;
  disabled?: boolean;
}

export interface IValidation {
  type: string;
  value?: boolean | number;
  message: string;
  selected: boolean;
}
