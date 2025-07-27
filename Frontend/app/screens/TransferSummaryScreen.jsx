import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';

const TransferSummaryScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Image
          source={{
            uri: 'https://img.icons8.com/ios-filled/50/000000/left.png',
          }}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      {/* Amount Box */}
      <View style={styles.amountBox}>
        <View style={styles.row}>
          <Text style={styles.amountText}>0.00</Text>
          <View style={styles.flagRow}>
            <Image
              source={{ uri: 'https://flagcdn.com/w320/gb.png' }}
              style={styles.flag}
            />
            <Text style={styles.countryCode}>UK</Text>
          </View>
        </View>
        <Text style={styles.label}>Send</Text>

        <View style={styles.separator} />

        <View style={styles.row}>
          <Text style={styles.amountText}>0.00</Text>
          <View style={styles.flagRow}>
            <Image
              source={{ uri: 'https://flagcdn.com/w320/gh.png' }}
              style={styles.flag}
            />
            <Text style={styles.countryCode}>GHS</Text>
          </View>
        </View>
        <Text style={styles.label}>Receive</Text>
      </View>

      {/* Exchange Rate */}
      <Text style={styles.exchangeRate}>1 GBP = 13.86 GHS</Text>

      {/* Fee Box */}
      <View style={styles.feeBox}>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Flat fee</Text>
          <Text style={styles.feeValue}>GBP 4.45</Text>
        </View>
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Fee discount</Text>
          <Text style={styles.feeValue}>-GBP 4.45</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.feeRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>GBP 0.00</Text>
        </View>
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => router.push('/screens/MethodOfPaymentScreen')}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>

      {/* Offer Note */}
      <Text style={styles.offerNote}>
        <Text style={styles.offerBold}>New customer offer applied:</Text> zero fees on this transfer.
      </Text>
    </View>
  );
};

export default TransferSummaryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#800080',
  },
  amountBox: {
    borderWidth: 1.5,
    borderColor: '#800080',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    marginTop: 60,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flag: {
    width: 25,
    height: 18,
    resizeMode: 'contain',
    borderRadius: 2,
  },
  countryCode: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  amountText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  label: {
    color: '#800080',
    marginTop: 4,
    marginBottom: 8,
    fontSize: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#80008030',
    marginVertical: 10,
  },
  exchangeRate: {
    textAlign: 'center',
    color: '#800080',
    marginBottom: 20,
    fontWeight: '600',
  },
  feeBox: {
    borderWidth: 1.5,
    borderColor: '#800080',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  feeLabel: {
    color: '#555',
  },
  feeValue: {
    color: '#800080',
    fontWeight: '600',
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalValue: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#800080',
  },
  continueButton: {
    backgroundColor: '#800080',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  offerNote: {
    marginTop: 16,
    textAlign: 'center',
    color: '#800080',
  },
  offerBold: {
    fontWeight: 'bold',
  },
}); 