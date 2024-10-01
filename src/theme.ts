import {
  Button,
  createTheme,
  Paper,
  Select,
  Textarea,
  TextInput,
} from '@mantine/core';
import buttonClasses from './styles/button.module.css';
import inputClasses from './styles/input.module.css';
import paperClasses from './styles/paper.module.css';

export const theme = createTheme({
  fontFamily: 'Sora',
  defaultRadius: 'sm',

  colors: {
    steel: [
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
    ],
    dark: [
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
    ],
  },
  components: {
    Button: Button.extend({
      classNames: buttonClasses,
    }),
    TextInput: TextInput.extend({
      classNames: inputClasses,

      defaultProps: {
        inputWrapperOrder: ['label', 'input', 'description', 'error'],
      },
    }),
    Textarea: Textarea.extend({
      classNames: inputClasses,
      defaultProps: {
        inputWrapperOrder: ['label', 'input', 'description', 'error'],
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
        inputWrapperOrder: ['label', 'input', 'description', 'error'],
      },
    }),
  },

  /* Put your mantine theme override here */
});
