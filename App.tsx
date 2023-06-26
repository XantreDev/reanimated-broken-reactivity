/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {
  DerivedValue,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const mapTimes = <T,>(times: number, callback: (time: number) => T) =>
  new Array(times).fill(undefined).map((__, i) => callback(i + 1));
const logOnJs = (name: string, value: unknown) =>
  console.log(name, value);

const sumWorklet =(arr: SharedValue<number>[]) => {
  'worklet'

  return arr.reduce((acc, v) => acc + v.value, 0) 
}


function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const updatesCountRef = useRef(0)

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const counter = useSharedValue(0);

  const derivedValues = mapTimes(100, time =>
    useDerivedValue(() => counter.value * time),
  );
  
  const sum1 = useDerivedValue(() => derivedValues.reduce((acc, v) => acc + v.value, 0))
  const sum2= useDerivedValue(() => derivedValues.reduce((acc, v) => acc + v.value, 0))
  const sum = useDerivedValue(() => sum1.value + sum2.value)


  useAnimatedReaction(
    () => sum.value,
    v => runOnJS(logOnJs)('sum', v),
  );
  useEffect(() => {
    const intervalId = setInterval(() => {
      counter.value = Math.random() * 100
      updatesCountRef.current++
      console.log('update', updatesCountRef.current)
    }, 0.2);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
