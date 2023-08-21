import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentForm } from './PaymentForm';

const PUBLIC_KEY = 'pk_test_51NMcj5EAasHKTiDVBF1xpJoVdoSjqUUU1Cc8G1DdRt01Uomf8dJt9F803IusLCsJrkKYw40qByj2J7drUspRJ0DZ002cqtHzK0';

const stripeTestPromise = loadStripe(PUBLIC_KEY);

interface StripeProps {
  points: number;
}

export const StripeContainer = (props: StripeProps) => {
  return (
    <>
      <Elements stripe={stripeTestPromise}>
        <PaymentForm points={props.points}/>
      </Elements>
    </>
  );
};
