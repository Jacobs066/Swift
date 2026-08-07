// components/DotIndicator.jsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const DotIndicator = ({ total, currentIndex, activeColor, inactiveColor }) => {
  const { colors } = useTheme();
  const active = activeColor || colors.accent;
  const inactive = inactiveColor || colors.disabled;

  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            { backgroundColor: currentIndex === index ? active : inactive },
          ]}
        />
      ))}
    </View>
  );
};

export default DotIndicator;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  dot: {
    height: 6,
    width: 20,
    borderRadius: 3,
    marginHorizontal: 4,
  },
});
