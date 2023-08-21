import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputProps,
  NumberInputStepper
} from '@chakra-ui/react';
import { Field } from 'formik';

export interface CustomNumberInputProps extends NumberInputProps {
      label?: string;
      error?: string;
  }

export const CustomNumberInput = (props: CustomNumberInputProps) => {
  return (
    <FormControl isInvalid={props.isInvalid}>
      <FormLabel mr='0' mb='1' htmlFor={props.name}>
        {props.label}
        <Field as={NumberInput} {...props} border='1px solid white' borderRadius='md' pattern='[0-9]+'>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </Field>
      </FormLabel>
      <FormErrorMessage mt='-1' mb='1'>
        {props.error}
      </FormErrorMessage>
    </FormControl>
  );
};

