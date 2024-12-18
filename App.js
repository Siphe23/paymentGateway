import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { AntDesign } from '@expo/vector-icons';

const App = () => {
  const stripePublishableKey = 'pk_test_51Q7YPz09Ta8MClJBUH2kbUiZN5oCcKm2J5qp3qZu7p5PN6hDt9CPrfZHwdI1swVFymlreTXSl3aLRfDTLNzSgTLu00z98j4NHf'; // Your publishable key

  return (
    <StripeProvider publishableKey={stripePublishableKey}>
      <View style={styles.container}>
        <Cart />
      </View>
    </StripeProvider>
  );
};

const Cart = () => {
  const [quantity, setQuantity] = useState(1);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const exchangeRate = 18.5; // Example rate: 1 USD = 18.5 ZAR (Update with real-time data if needed)
  const itemPriceUSD = 20.0; // Item price in USD
  const itemPriceZAR = (itemPriceUSD * exchangeRate).toFixed(2); // Price in ZAR

  const handlePayment = async () => {
    try {
      const amountInCents = Math.round(itemPriceZAR * quantity * 100); // Amount in cents (ZAR)
      console.log('Amount (in cents):', amountInCents); // Log the amount
      console.log('Currency:', 'ZAR'); // Log the currency
      
      const response = await fetch('http://localhost:8000/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInCents,  
          currency: 'ZAR',
        }),
      });
      
      const { paymentIntent, ephemeralKey, customer } = await response.json();
      console.log(paymentIntent, ephemeralKey, customer); // Log to check the response
      
     
      if (paymentIntent) {
        const initSheet = await initPaymentSheet({
          paymentIntentClientSecret: paymentIntent,
          customerEphemeralKeySecret: ephemeralKey,
          customerId: customer,
        });
  
        if (initSheet.error) {
          Alert.alert('Error', initSheet.error.message);
          return;
        }
  
        const paymentResult = await presentPaymentSheet();
        if (paymentResult.error) {
          Alert.alert('Payment Failed', paymentResult.error.message);
        } else {
          Alert.alert('Success', 'Payment Completed!');
        }
      } else {
        Alert.alert('Error', 'PaymentIntent creation failed.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };
  

  return (
    <View style={styles.cart}>
     <Image 
  source={require('./images/comfortable-chair.jpg')} 
  style={styles.itemImage} 
/>

      <Text style={styles.itemName}>Comfortable Chair</Text>
      <Text style={styles.price}>Price: R{itemPriceZAR}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>
          <AntDesign name="minuscircle" size={24} color="#ff8c00" />
        </TouchableOpacity>
        <Text style={styles.quantity}>{quantity}</Text>
        <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
          <AntDesign name="pluscircle" size={24} color="#ff8c00" />
        </TouchableOpacity>
      </View>
      <Text style={styles.totalPrice}>Total: R{(itemPriceZAR * quantity).toFixed(2)}</Text>
      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.payButtonText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0e1', // Comfy Neutral background
    justifyContent: 'center',
    alignItems: 'center',
  },
  cart: {
    width: '90%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    alignItems: 'center',
  },
  itemImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  quantity: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  payButton: {
    backgroundColor: '#ff8c00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
