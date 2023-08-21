import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputProps } from '@chakra-ui/react';
import { Field } from 'formik';

export interface CustomInputProps extends InputProps {
      label?: string;
      error?: string;
      disabled?: boolean;
  }

export const CustomInput = (props: CustomInputProps) => {
  return (
    <FormControl isInvalid={props.isInvalid}>
      <FormLabel mr='2' mt='2' htmlFor={props.name}>
        {props.label}
        <Field as={props.as ?? Input} {...props} />
      </FormLabel>
      <FormErrorMessage mt='-1' mb='1'>
        {props.error}
      </FormErrorMessage>
    </FormControl>
  );
};
