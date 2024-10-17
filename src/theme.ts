import {
  ActionIcon,
  Button,
  createTheme,
  InputLabel,
  Modal,
  Paper,
  Popover,
  Radio,
  Select,
  Textarea,
  TextInput,
} from '@mantine/core';
import buttonClasses from './styles/button.module.css';
import inputClasses from './styles/input.module.css';
import paperClasses from './styles/paper.module.css';
import radioClasses from './styles/radio.module.css';
import globalClasses from './styles/global.module.css';
import { DateTimePicker } from '@mantine/dates';

export const STEEL = [
  '#f5f5f5',
  '#e7e7e7',
  '#cdcdcd',
  '#b2b2b2',
  '#9a9a9a',
  '#8b8b8b',
  '#848484',
  '#717171',
  '#656565',
  '#575757',
];

export const DARK = [
  '#D9D9D9',
  '#CCCCCC',
  '#BFBFBF',
  '#B3B3B3',
  '#404040',
  '#262626',
  '#191919',
  '#0D0D0D',
  '#000002',
  '#000000',
];

export const theme = createTheme({
  fontFamily: 'Sora',
  defaultRadius: 'sm',

  colors: {
    steel: [
      STEEL[0],
      STEEL[1],
      STEEL[2],
      STEEL[3],
      STEEL[4],
      STEEL[5],
      STEEL[6],
      STEEL[7],
      STEEL[8],
      STEEL[9],
    ],
    dark: [
      DARK[0],
      DARK[1],
      DARK[2],
      DARK[3],
      DARK[4],
      DARK[5],
      DARK[6],
      DARK[7],
      DARK[8],
      DARK[9],
    ],
  },
  components: {
    Button: Button.extend({
      classNames: buttonClasses,
    }),
    ActionIcon: ActionIcon.extend({
      classNames: buttonClasses,
    }),
    TextInput: TextInput.extend({
      classNames: inputClasses,

      defaultProps: {
        inputWrapperOrder: ['label', 'error', 'input', 'description'],
      },
    }),
    Textarea: Textarea.extend({
      classNames: inputClasses,
      defaultProps: {
        inputWrapperOrder: ['label', 'error', 'input', 'description'],
        autosize: true,
        minRows: 2,
        maxRows: 4,
      },
    }),
    Paper: Paper.extend({
      classNames: paperClasses,
    }),
    Select: Select.extend({
      classNames: {
        input: inputClasses.input,
        label: inputClasses.label,
        description: inputClasses.description,
        error: inputClasses.error,
        option: inputClasses.option,
      },
      defaultProps: {
        inputWrapperOrder: ['label', 'error', 'input', 'description'],
      },
    }),
    InputLabel: InputLabel.extend({
      defaultProps: {
        className: inputClasses.label,
      },
    }),
    Radio: Radio.extend({
      classNames: {
        root: radioClasses.radioRoot,
        label: radioClasses.radioLabel,
        radio: radioClasses.radio,
        body: radioClasses.radioBody,
        inner: radioClasses.radioInner,
      },
    }),
    DateTimePicker: DateTimePicker.extend({
      classNames: {
        input: inputClasses.input,
        label: inputClasses.label,
        submitButton: globalClasses.popoverDropdown,
        timeInput: inputClasses.timeInput,
        monthCell: inputClasses.calendarDay,
      },
      defaultProps: {
        clearable: true,
      },
    }),
    Popover: Popover.extend({
      classNames: {
        dropdown: globalClasses.popoverDropdown,
      },
    }),

    Modal: Modal.extend({
      classNames: {
        content: globalClasses.border,
      },
    }),
  },

  /* Put your mantine theme override here */
});
