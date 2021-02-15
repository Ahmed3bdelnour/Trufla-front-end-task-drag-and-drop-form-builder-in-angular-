import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  CdkDrag,
  CdkDragDrop,
  copyArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

import { ActionTypes, IAction, IField } from '../models/field.model';
import { IDynamicForm } from '../models/form.model';

@Component({
  selector: 'app-drag-and-drop-form-builder',
  templateUrl: './drag-and-drop-form-builder.component.html',
  styleUrls: ['./drag-and-drop-form-builder.component.scss'],
})
export class DragAndDropFormBuilderComponent implements OnInit {
  /** Form group object which will be created and rendered (Using Reactive forms approach). */
  createdForm: FormGroup;
  /** Js object represents the form and will be used to create it. */
  formObject: IDynamicForm;
  /** Boolean value to show or hide the form. */
  showForm: boolean = false;

  /** Available fields to choose from. */
  availableFields: IField[] = [];
  /** Available actions (buttons) to choose from. */
  availableActions: IAction[] = [];

  /** Selected fields from available fields. */
  selectedFields: IField[] = [];
  /** Selected actions from available actions. */
  selectedActions: IAction[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    /** Set available fields and actions with default values. */
    this.initAvailableFieldsAndActions();
  }

  /** Set available fields and actions with default values. */
  /** Validations are enabled by default for demo purposes. */
  initAvailableFieldsAndActions() {
    this.availableFields = [
      {
        type: 'text',
        label: 'Text Field',
        name: 'text',
        value: '',
        placeholder: '',
        validations: [
          {
            type: 'required',
            message: 'Field is required',
            selected: true,
          },
          {
            type: 'minlength',
            value: 10,
            message: 'Min length is 10',
            selected: true,
          },
          {
            type: 'maxlength',
            value: 50,
            message: 'Max length is 50',
            selected: true,
          },
        ],
        edit: false,
      },
      {
        type: 'radio',
        label: 'Radio Group',
        name: 'radio-group',
        value: '',
        inline: false,
        options: [
          {
            label: 'Option 1',
            value: 'option-1',
          },
          {
            label: 'Option 2',
            value: 'option-2',
          },
          {
            label: 'Option 3',
            value: 'option-3',
          },
        ],
        validations: [
          {
            type: 'required',
            message: 'Field is required',
            selected: true,
          },
        ],
        edit: false,
      },
      {
        type: 'checkbox',
        label: 'Checkbox Group',
        name: 'checkbox-group',
        inline: false,
        options: [
          {
            label: 'Option 1',
            value: 'option-1',
            selected: false,
          },
        ],
        validations: [
          {
            type: 'required',
            message: 'Field is required',
            selected: true,
          },
        ],
        edit: false,
      },
      {
        type: 'select',
        label: 'Select',
        name: 'select',
        placeholder: '',
        multiple: false,
        validations: [
          {
            type: 'required',
            message: 'Field is required',
            selected: true,
          },
        ],
        options: [
          {
            label: 'Option 1',
            value: 'option-1',
            selected: false,
          },
          {
            label: 'Option 2',
            value: 'option-2',
            selected: false,
          },
          {
            label: 'Option 3',
            value: 'option-3',
            selected: false,
          },
        ],
        edit: false,
      },
    ];

    this.availableActions = [
      {
        type: ActionTypes.submit,
        text: 'Submit',
      },
      {
        type: ActionTypes.cancel,
        text: 'Cancel',
      },
    ];
  }

  /** Add field to selected fields or sort selected fields. */
  dropOnSelectedFields(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      /** Sort selected fields. */
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      /** Add field to selected fields. */
      const droppedField = event.previousContainer.data[event.previousIndex];
      const selectedField = JSON.parse(JSON.stringify(droppedField));
      selectedField.name = selectedField.name + '-' + new Date().getTime();
      this.selectedFields.splice(event.currentIndex, 0, selectedField);
    }
  }

  /** Add action to selected actions or sort actions. */
  dropOnSelectedActions(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      /** Sort selected actions. */
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      /** Add action to selected actions. */
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  /** Predicate function that doesn't allow items to be dropped into available fields or actions list. */
  noReturnPredicate() {
    return false;
  }

  /** Predicate function that doesn't allow repeating of cancel or submit button. */
  selectedActionsPredicate = (item: CdkDrag<IAction>) => {
    const itemIndex = this.selectedActions.findIndex(
      (action) => action.type === item.data.type
    );
    const isItemSelected = itemIndex !== -1;
    return this.selectedActions.length <= 1 && !isItemSelected;
  };

  /** Remove field from selected fields. */
  removeSelectedField(index: number) {
    this.selectedFields.splice(index, 1);
  }

  /** Open or close a form to edit field. */
  toggleEditSelectedField(index: number) {
    this.selectedFields[index].edit = !this.selectedFields[index].edit;
  }

  /** Remove action from selected actions. */
  removeSelectedAction(index: number) {
    this.selectedActions.splice(index, 1);
  }

  /** Add or remove option to a checkbox group. */
  addOrRemoveOptionToCheckboxGroup(event, fieldName: string, value: string) {
    const checked = event.target.checked;
    const checkboxFormArray = <FormArray>this.createdForm.get(fieldName);

    if (checked) {
      checkboxFormArray.push(this.fb.control(value));
    } else {
      const indexToRemove = checkboxFormArray.controls.findIndex(
        (control) => control.value === value
      );
      checkboxFormArray.removeAt(indexToRemove);
    }
  }

  /** Remove option from field options. */
  removeOption(fieldIndex: number, optionIndex: number) {
    this.selectedFields[fieldIndex].options.splice(optionIndex, 1);
  }

  /** Add option to field options. */
  addOption(fieldIndex: number) {
    let newOption;
    const field = this.selectedFields[fieldIndex];
    const newOptionIndex = field.options.length + 1;

    if (field.type === 'checkbox') {
      newOption = {
        label: 'Option ' + newOptionIndex,
        value: 'Option-' + newOptionIndex,
      };
    } else if (field.type === 'select') {
      const disabledOptionIndex = field.options.findIndex(
        (option) => option.disabled
      );
      const isOneOptionDisabled = disabledOptionIndex !== -1;

      newOption = {
        label: 'Option ' + newOptionIndex,
        value: 'Option-' + newOptionIndex,
        disabled: isOneOptionDisabled,
      };
    } else {
      newOption = {
        label: 'Option ' + newOptionIndex,
        value: 'Option-' + newOptionIndex,
        selected: false,
      };
    }

    field.options.push(newOption);
  }

  /** Disable or enable options for single select. */
  disableOrDisableOtherOptionsForSingleSelect(
    event,
    field: IField,
    optionIndex: number
  ) {
    if (
      (field.type === 'select' && field.multiple) ||
      field.type === 'checkbox'
    )
      return;

    const checked = event.target.checked;

    if (checked) {
      this.disableOptions(field, optionIndex);
    } else {
      this.enableOptions(field);
    }
  }

  /** Disable options except optionIndex. */
  disableOptions(field: IField, optionIndex: number) {
    field.options.forEach((option, i) => {
      if (i !== optionIndex) {
        option.disabled = true;
      }
    });
  }

  /** Enable all options. */
  enableOptions(field: IField) {
    field.options.forEach((option, i) => {
      option.disabled = false;
    });
  }

  /** Unselect all options. */
  unselectOptions(field: IField) {
    field.options.forEach((option, i) => {
      option.selected = false;
    });
  }

  /** Remove default null value when select value changes. */
  filterNullValue(field: IField) {
    const control = this.createdForm.get(field.name);
    const filteredValue = control.value.filter((value) => value !== null);
    control.setValue(filteredValue);
  }

  /** Should remove the option or not. */
  showRemoveIcon(field: IField, index: number) {
    let show: boolean = false;

    if (
      ((field.type === 'radio' || field.type === 'select') && index > 1) ||
      (field.type === 'checkbox' && index > 0)
    ) {
      show = true;
    }

    return show;
  }

  /** Create and render the form with dragged fields and actions. */
  renderForm() {
    /** Check if there are more than one field have the same name. */
    if (this.isNameRepeated(this.selectedFields)) {
      window.alert(
        'One or more fields has the same name!!! \n please give a unique name for each field.'
      );
      return;
    }

    /** Set formObject. */
    this.formObject = {
      fields: JSON.parse(JSON.stringify(this.selectedFields)),
      actions: JSON.parse(JSON.stringify(this.selectedActions)),
    };

    /** Sort submit and cancel actions. */
    this.sortActions(this.formObject);

    /** Create Form group object with validations. */
    this.createForm(this.formObject);

    /** Render created form. */
    this.showForm = true;
  }

  /** Check if there are more than one field have the same name or not. */
  isNameRepeated(selectedFields: IField[]) {
    const fieldsNames = selectedFields.map((field) => field.name);
    const fieldsNamesSet = new Set(fieldsNames);
    const uniqueFieldsNames = [...fieldsNamesSet];

    return fieldsNames.length !== uniqueFieldsNames.length;
  }

  /** Sort submit and cancel actions. */
  sortActions(form: IDynamicForm) {
    form.actions.sort((a, b) => {
      if (a.type > b.type) {
        return 1;
      } else if (a.type < b.type) {
        return -1;
      }
      return 0;
    });
  }

  /** Create Form group object with validations. */
  createForm(form: IDynamicForm) {
    this.createdForm = this.fb.group({});
    const fields: IField[] = form.fields;

    fields.forEach((field) => {
      const validators: ValidatorFn[] = this.createControlValidators(field);

      let control: AbstractControl;

      if (field.type === 'select') {
        const selectedOptions: string[] = [];
        field.options.forEach((option) => {
          if (option.selected) {
            selectedOptions.push(option.value);
          }
        });
        const selectedValues =
          selectedOptions.length > 0 ? selectedOptions : [null];
        control = this.fb.control(selectedValues, validators);
      } else if (field.type === 'checkbox') {
        const controlsArray: FormControl[] = [];
        field.options.forEach((option) => {
          if (option.selected) {
            controlsArray.push(this.fb.control(option.value));
          }
        });

        control = this.fb.array(controlsArray, validators);
      } else {
        control = this.fb.control(field.value, validators);
      }

      this.createdForm.addControl(field.name, control);
    });
  }

  /** Create validators for each control in created form. */
  createControlValidators(field: IField) {
    const validators: ValidatorFn[] = [];

    field.validations.forEach((validation) => {
      let validatorFn: ValidatorFn;

      if (validation.selected) {
        if (validation.type === 'required') {
          if (field.type !== 'select') {
            validatorFn = Validators.required;
          } else {
            validatorFn = (control: FormControl) => {
              const value = control.value;
              const index = value.findIndex((v) => v === null);
              const hasNull = index !== -1;
              return hasNull
                ? {
                    selectRequired: true,
                  }
                : null;
            };
          }
        } else if (validation.type === 'minlength') {
          const minLength = validation.value as number;
          validatorFn = Validators.minLength(minLength);
        } else if (validation.type === 'maxlength') {
          const maxLength = validation.value as number;
          validatorFn = Validators.maxLength(maxLength);
        }
      }

      if (validatorFn) validators.push(validatorFn);
    });

    return validators;
  }

  /** Click cancel button. */
  cancelHandler() {
    window.alert('Cancel button is clicked');
  }

  /** Click submit button. */
  submitHandler() {
    if (this.createdForm.invalid) {
      window.alert('Form is not valid');
    } else {
      window.alert('Form value is \n' + JSON.stringify(this.createdForm.value));
    }
  }
}
