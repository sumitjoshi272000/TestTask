import React from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet } from 'react-native';
import { useTestTask } from '../hooks/useTestTask';
import { LineChart } from 'react-native-gifted-charts';
import { COLORS } from '../utils/colors';

const TestTaskScreen = () => {
  const socketData = useTestTask('btcusdt');

  const priceChartData = socketData
    .map((rowData, rowIndex) => ({
      value: parseFloat(rowData.price),
      label: new Date(rowData.time).toLocaleTimeString().slice(3, 8),
    }));

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Socket Implementation Test Task</Text>

      <LineChart
        data={priceChartData}
        areaChart
        initialSpacing={20}
        spacing={50}
      />

      <FlatList
        data={socketData}
        keyExtractor={(_rowData, rowIndex) => rowIndex.toString()}
        renderItem={({ item: rowData, index: rowIndex }) => {
          const currentPrice = parseFloat(rowData.price);
          const previousPrice = parseFloat(socketData[rowIndex + 1]?.price || '0');
          const isPriceUp = currentPrice >= previousPrice;

          return (
            <View style={styles.card}>
              <Text style={[styles.price, { color: isPriceUp ? COLORS.cardUp : COLORS.cardDown }]}>{currentPrice}</Text>
              <Text style={styles.time}>
                {new Date(rowData.time).toLocaleTimeString()}
              </Text>
            </View>
          );
        }}
        ListHeaderComponent={<Text style={styles.subtitle}>BTC Price Updates</Text>}
      />
    </SafeAreaView>
  );
};

export default TestTaskScreen;

const styles = StyleSheet.create({
  container: { flex: 1, margin: 16, backgroundColor: COLORS.background },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: COLORS.textPrimary },
  subtitle: { fontSize: 18, marginVertical: 10, color: COLORS.textPrimary },
  card: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  price: { fontSize: 18, fontWeight: 'bold' },
  time: { fontSize: 14, color: COLORS.textSecondary },
}); 