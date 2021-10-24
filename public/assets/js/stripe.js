import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_51JF14GFpMZQ7tObGbjvdwsLVTrc40jbbeQ9GvSAd3bvSyLBj0v1FQbN2Kw45uAqJ9vVOxDhTaUj7XLuHVhiaRfIl00CNXx1uhL');

export const bookService = async serviceId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${serviceId}`);
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};