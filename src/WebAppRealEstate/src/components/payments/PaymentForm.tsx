import { useContext, useState } from 'react';
import axios from 'axios';
import { Box, Button, FormLabel, Text as Info } from '@chakra-ui/react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeCardElementOptions } from '@stripe/stripe-js';
import { useTranslation } from 'react-i18next';
import { UserContext } from '@/contexts';

const CARD_OPTIONS: StripeCardElementOptions = {
  iconStyle: 'solid',
  style: {
    base: {
      iconColor: '#c4f0ff',
      color: '#fff',
      fontWeight: 500,
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': { color: '#fce883' },
      '::placeholder': { color: '#87bbfd' }
    },
    invalid: {
      iconColor: '#ffc7ee',
      color: '#ffc7ee'
    }
  }
};

interface PaymentProps {
  points: number;
}

export const PaymentForm = (props: PaymentProps) => {
  const [success, setSuccess] = useState(false);
  const stripes = useStripe();
  const elements = useElements();
  const [t] = useTranslation('common');
  const {currentUser} = useContext(UserContext);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (!stripes || !elements) {
        return;
      }
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        return;
      }
      const { error, paymentMethod } = await stripes.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
      if (error) {
        console.error('Error creating payment method:', error);
        return;
      }
      const { id } = paymentMethod;
      const response = await axios.post('http://localhost:5019/api/v1/advertisement/payment-intent', {
        amount: props.points,
        id: id,
        idUser: currentUser?.id
      });
      if (response.data.clientSecret) {
        const { clientSecret } = response.data;
        const { error: confirmError } = await stripes.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              // Provide billing details if needed
            },
          },
        });
        if (confirmError) {
          console.error('Error confirming payment:', confirmError);
          return;
        }
        console.log('Successful payment');
        setSuccess(true);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <>
      {success ? (
        <Box>
          <FormLabel>{t('successPayment')}</FormLabel>
        </Box>
      ) : (
        <Box w='600px' ml='25%'>
          <Info ml={3} mb={2} textColor='blue.800' fontSize='25'>{t('Please enter card credentials')}</Info>
          <form onSubmit={handleSubmit}>
            <fieldset className='FormGroup'>
              <div className='FormRow'>
                <CardElement options={CARD_OPTIONS} />
              </div>
            </fieldset>
            <Button
              type='submit'
              textColor='white'
              ml={3}
              bg='blue.500'
              _hover={{bg: 'blue.600'}}>
              {t('pay')}
            </Button>
          </form>
        </Box>
      )}
    </>
  );
};
