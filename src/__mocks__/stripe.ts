const createMock = jest.fn().mockResolvedValue({
    client_secret: 'mocked_client_secret',
  });
  
  const paymentIntents = {
    create: createMock,
  };
  
  const Stripe = jest.fn().mockImplementation(() => ({
    paymentIntents,
  }));
  
  export default Stripe;
  