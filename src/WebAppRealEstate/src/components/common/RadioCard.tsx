import { Box, useRadio } from '@chakra-ui/react';

export const RadioCard = (props: any) => {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        borderRadius='md'
        boxShadow='md'
        _checked={{
          bg: 'blue.600',
          color: 'white',
          borderColor: 'blue.600',
        }}
        _focus={{
          boxShadow: 'outline',
          bg: 'blue.600'
        }}
        px={5}
        py={3}
        mt={1}>
        {props.children}
      </Box>
    </Box>
  );
};
