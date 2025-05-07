import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { Heart, Thermometer } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Header from '@/components/ui/Header';

export default function VitalsScreen() {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const [heartRate, setHeartRate] = useState(72);
  const [temperature, setTemperature] = useState(36.6);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate((prev) => prev + (Math.random() * 2 - 1));
      setTemperature((prev) => prev + (Math.random() * 0.1 - 0.05));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#111' : '#f5f5f5' },
      ]}
    >
      <View style={styles.content}>
        <Surface
          style={[styles.card, { backgroundColor: isDark ? '#222' : '#fff' }]}
        >
          <View style={styles.cardHeader}>
            <Heart size={24} color="#FF6B6B" />
            <Text
              style={[styles.cardTitle, { color: isDark ? '#fff' : '#333' }]}
            >
              Heart Rate
            </Text>
          </View>

          <Text style={[styles.value, { color: isDark ? '#fff' : '#333' }]}>
            {heartRate.toFixed(1)}
          </Text>
          <Text style={[styles.unit, { color: isDark ? '#bbb' : '#666' }]}>
            BPM
          </Text>

          <View style={styles.rangeContainer}>
            <Text
              style={[styles.rangeText, { color: isDark ? '#bbb' : '#666' }]}
            >
              Normal Range: 60-100 BPM
            </Text>
            <View style={styles.rangeBar}>
              <View
                style={[
                  styles.rangeFill,
                  {
                    width: `${(heartRate - 60) / 0.4}%`,
                    backgroundColor:
                      heartRate > 100 || heartRate < 60 ? '#FF6B6B' : '#4CAF50',
                  },
                ]}
              />
            </View>
          </View>
        </Surface>

        <Surface
          style={[styles.card, { backgroundColor: isDark ? '#222' : '#fff' }]}
        >
          <View style={styles.cardHeader}>
            <Thermometer size={24} color="#4C1D95" />
            <Text
              style={[styles.cardTitle, { color: isDark ? '#fff' : '#333' }]}
            >
              Body Temperature
            </Text>
          </View>

          <Text style={[styles.value, { color: isDark ? '#fff' : '#333' }]}>
            {temperature.toFixed(1)}
          </Text>
          <Text style={[styles.unit, { color: isDark ? '#bbb' : '#666' }]}>
            °C
          </Text>

          <View style={styles.rangeContainer}>
            <Text
              style={[styles.rangeText, { color: isDark ? '#bbb' : '#666' }]}
            >
              Normal Range: 36.1-37.2°C
            </Text>
            <View style={styles.rangeBar}>
              <View
                style={[
                  styles.rangeFill,
                  {
                    width: `${(temperature - 36.1) / 0.011}%`,
                    backgroundColor:
                      temperature > 37.2 || temperature < 36.1
                        ? '#FF6B6B'
                        : '#4CAF50',
                  },
                ]}
              />
            </View>
          </View>
        </Surface>

        <Text style={[styles.disclaimer, { color: isDark ? '#bbb' : '#666' }]}>
          Note: This is simulated data. Real sensor integration coming soon.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  value: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  unit: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginTop: 4,
  },
  rangeContainer: {
    marginTop: 16,
  },
  rangeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  rangeBar: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  rangeFill: {
    height: '100%',
    borderRadius: 4,
  },
  disclaimer: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 24,
    fontStyle: 'italic',
  },
});
