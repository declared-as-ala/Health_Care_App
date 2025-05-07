// screens/ActivityScreen.tsx

import React, { useState, useEffect, memo, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  RefreshControl,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { Pedometer } from 'expo-sensors';
import { LineChart } from 'react-native-chart-kit';
import { Zap, Clock, Flame, CheckCircle } from 'lucide-react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useTheme } from '@/context/ThemeContext';
import Header from '@/components/ui/Header';

const STEP_GOAL = 10000;
const CAL_PER_STEP = 0.04;
type Tab = 'Summary' | 'Charts' | 'Tasks';

const SummaryItem = memo(({ icon, label, value, dark }: any) => (
  <View style={styles.summaryItem}>
    <View style={styles.summaryIcon}>{icon}</View>
    <Text style={[styles.summaryValue, { color: dark ? '#fff' : '#000' }]}>
      {value}
    </Text>
    <Text style={[styles.summaryLabel, { color: dark ? '#bbb' : '#666' }]}>
      {label}
    </Text>
  </View>
));

export default function ActivityScreen() {
  const { actualTheme } = useTheme();
  const dark = actualTheme === 'dark';
  const isWeb = Platform.OS === 'web';
  const { width } = useWindowDimensions();

  const [stepsToday, setStepsToday] = useState(0);
  const [caloriesToday, setCaloriesToday] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<Tab>('Summary');
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    let cumulative = 0;

    const init = async () => {
      try {
        // Request permission (iOS)
        const { granted } = (await (
          Pedometer as any
        ).requestPermissionsAsync?.()) ?? { granted: true };
        if (!granted) {
          setError('Permission denied for motion data.');
          return;
        }

        // Check availability
        const available = await Pedometer.isAvailableAsync();
        if (!available) {
          setError('Pedometer not available.');
          return;
        }

        // Historical steps from midnight → now
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();

        // *** FIXED CALL SIGNATURE ***
        const result = await Pedometer.getStepCountAsync(start, end);
        console.log('Historical steps:', result.steps);
        cumulative = result.steps;
        setStepsToday(cumulative);
        setCaloriesToday(Math.round(cumulative * CAL_PER_STEP));

        // Live updates (delta steps)
        subscriptionRef.current = Pedometer.watchStepCount(
          ({ steps: delta }) => {
            cumulative += delta;
            setStepsToday(cumulative);
            setCaloriesToday(Math.round(cumulative * CAL_PER_STEP));
          }
        );
      } catch (e: any) {
        console.error('Pedometer init error:', e);
        setError('Failed to initialize pedometer.');
      }
    };

    init();

    return () => {
      subscriptionRef.current?.remove();
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 500));
    setRefreshing(false);
  };

  const gaugeSize = (width - 64) / 2;
  const chartWidth = width - 32;
  const lineSteps = [0, stepsToday];
  const lineCals = [0, caloriesToday];
  const chartConfig = {
    backgroundGradientFrom: dark ? '#1a1a1a' : '#fff',
    backgroundGradientTo: dark ? '#333' : '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) =>
      dark ? `rgba(255,255,255,${opacity})` : `rgba(76,29,149,${opacity})`,
    labelColor: (opacity = 1) =>
      dark ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`,
    style: { borderRadius: 16 },
  };

  if (isWeb) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: dark ? '#111' : '#f5f5f5' },
        ]}
      >
        <Header title="Activity" />
        <Text style={styles.webMsg}>Pedometer isn’t supported on web.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: dark ? '#111' : '#f5f5f5' }]}
    >
      <Header title="Activity" />

      <View
        style={[
          styles.tabContainer,
          { backgroundColor: dark ? '#222' : '#eee' },
        ]}
      >
        {(['Summary', 'Charts', 'Tasks'] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={styles.tabButton}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    selectedTab === tab
                      ? dark
                        ? '#fff'
                        : '#4C1D95'
                      : dark
                      ? '#888'
                      : '#666',
                  fontWeight: selectedTab === tab ? '600' : '400',
                },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {error && <Text style={styles.errorText}>{error}</Text>}

        {selectedTab === 'Summary' && (
          <View style={styles.summaryContainer}>
            <SummaryItem
              icon={<Zap size={24} color="#7C3AED" />}
              label="Steps"
              value={stepsToday}
              dark={dark}
            />
            <SummaryItem
              icon={<Clock size={24} color="#EC4899" />}
              label="Active"
              value={`${Math.round(stepsToday / 100)} m`}
              dark={dark}
            />
            <SummaryItem
              icon={<Flame size={24} color="#0D9488" />}
              label="Calories"
              value={caloriesToday}
              dark={dark}
            />
          </View>
        )}

        {selectedTab === 'Charts' && (
          <>
            <View style={styles.summaryGauges}>
              <GaugeCard
                title="Steps"
                value={`${stepsToday}/${STEP_GOAL}`}
                percent={Math.min(
                  Math.round((stepsToday / STEP_GOAL) * 100),
                  100
                )}
                size={gaugeSize}
                tint="#7C3AED"
                bg={dark ? '#333' : '#DDD6FE'}
                isDark={dark}
              />
              <GaugeCard
                title="Calories"
                value={`${caloriesToday}/${Math.round(
                  STEP_GOAL * CAL_PER_STEP
                )}`}
                percent={Math.min(
                  Math.round(
                    (caloriesToday / (STEP_GOAL * CAL_PER_STEP)) * 100
                  ),
                  100
                )}
                size={gaugeSize}
                tint="#EC4899"
                bg={dark ? '#333' : '#FBCFE8'}
                isDark={dark}
              />
            </View>
            <View style={styles.chartsRow}>
              <ChartBox
                title="Steps"
                data={lineSteps}
                width={chartWidth}
                chartConfig={chartConfig}
                dark={dark}
              />
              <ChartBox
                title="Calories"
                data={lineCals}
                width={chartWidth}
                chartConfig={chartConfig}
                dark={dark}
              />
            </View>
          </>
        )}

        {selectedTab === 'Tasks' && (
          <View
            style={[
              styles.taskContainer,
              styles.cardShadow,
              { backgroundColor: dark ? '#1a1a1a' : '#fff' },
            ]}
          >
            {/* … your tasks here … */}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function GaugeCard({ title, value, percent, tint, bg, size, isDark }: any) {
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View
      style={[
        styles.gaugeWrapper,
        {
          width: size + 24,
          backgroundColor: `${isDark ? '#222' : '#fff'}CC`,
          opacity: fade,
          transform: [{ scale: fade }],
        },
      ]}
    >
      <Text style={[styles.gaugeTitle, { color: isDark ? '#fff' : '#000' }]}>
        {title}
      </Text>
      <AnimatedCircularProgress
        size={size}
        width={12}
        fill={percent}
        tintColor={tint}
        backgroundColor={bg}
        rotation={0}
        duration={700}
        lineCap="round"
      >
        {() => (
          <Text
            style={[styles.gaugeCenter, { color: isDark ? '#fff' : '#000' }]}
          >
            {percent}%
          </Text>
        )}
      </AnimatedCircularProgress>
      <Text style={[styles.gaugeValue, { color: isDark ? '#fff' : '#000' }]}>
        {value}
      </Text>
    </Animated.View>
  );
}

function ChartBox({ title, data, width, chartConfig, dark }: any) {
  return (
    <View
      style={[
        styles.chartBox,
        styles.cardShadow,
        { backgroundColor: dark ? '#1a1a1a' : '#fff' },
      ]}
    >
      <Text style={[styles.chartTitle, { color: dark ? '#fff' : '#000' }]}>
        {title}
      </Text>
      <LineChart
        data={{ labels: ['Start', 'Now'], datasets: [{ data }] }}
        width={width}
        height={160}
        chartConfig={chartConfig}
        style={{ borderRadius: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  webMsg: { textAlign: 'center', fontSize: 16, marginVertical: 24 },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 12 },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  tabButton: { paddingHorizontal: 12 },
  tabText: { fontSize: 16 },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(124,58,237,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  summaryValue: { fontSize: 20, fontWeight: '600', marginBottom: 4 },
  summaryLabel: { fontSize: 12, fontWeight: '500' },
  summaryGauges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  gaugeWrapper: { borderRadius: 16, padding: 12, alignItems: 'center' },
  gaugeTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  gaugeCenter: { fontSize: 18, fontWeight: '700' },
  gaugeValue: { fontSize: 14, fontWeight: '500', marginTop: 8 },
  chartsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  chartBox: { width: '48%', padding: 16, borderRadius: 16 },
  chartTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  taskContainer: { borderRadius: 16, padding: 16, marginBottom: 32 },
  cardShadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: { elevation: 4 },
    default: { boxShadow: '0 4px 10px rgba(0,0,0,0.06)' },
  }),
});
