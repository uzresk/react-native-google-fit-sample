import React, {type PropsWithChildren, useState} from 'react';
import {
  Button,
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
  Header,
  LearnMoreLinks,
} from 'react-native/Libraries/NewAppScreen';
import GoogleFit, {BucketUnit, Scopes} from 'react-native-google-fit';

const Section: React.FC<
  PropsWithChildren<{
    title: string;
  }>
> = ({children, title}) => {
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
};

const App = () => {
  var [weight, setWeight] = useState(0);
  var [heartRate, setHeartRate] = useState(0);
  var [dailySteps, setdailySteps] = useState(0);
  var [bloodPressure, setBloodPressure] = useState({});

  const options = {
    scopes: [
      Scopes.FITNESS_ACTIVITY_READ,
      Scopes.FITNESS_HEART_RATE_READ,
      Scopes.FITNESS_BODY_READ,
      Scopes.FITNESS_BLOOD_PRESSURE_READ,
      Scopes.FITNESS_BLOOD_GLUCOSE_READ,
    ],
  };

  GoogleFit.checkIsAuthorized().then(() => {
    var authorized = GoogleFit.isAuthorized;
    console.log(authorized);
    if (authorized) {
      // if already authorized, fetch data
    } else {
      // Authentication if already not authorized for a particular device
      GoogleFit.authorize(options)
        .then(authResult => {
          if (authResult.success) {
            console.log('AUTH_SUCCESS');
            // if successfully authorized, fetch data
          } else {
            console.log('AUTH_DENIED ' + authResult.message);
          }
        })
        .catch(() => {
          dispatch('AUTH_ERROR');
        });
    }
  });
  var today = new Date();
  var lastWeekDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 8,
  );

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const fetchWeight = async () => {
    const opt = {
      unit: 'kg', // required; default 'kg'
      startDate: '2017-01-01T00:00:17.971Z',
      endDate: new Date().toISOString(),
      bucketUnit: BucketUnit.DAY,
      bucketInterval: 1,
      ascending: false,
    };
    const res = await GoogleFit.getWeightSamples(opt);
    let data = res.reverse();
    console.log(data);
    setWeight(Math.round(data[0].value * 100) / 100);
  };

  const fetchHeartRate = async () => {
    const opt = {
      startDate: '2017-01-01T00:00:17.971Z',
      endDate: today.toISOString(),
      bucketUnit: BucketUnit.DAY,
      bucketInterval: 1,
    };
    const res = await GoogleFit.getHeartRateSamples(opt);
    let data = res.reverse();
    console.log(data);
    if (data.length === 0) {
      setHeartRate('Not Found');
    } else {
      setHeartRate(data[0].value);
    }
  };

  const fetchBloodPressure = async () => {
    const opt = {
      startDate: lastWeekDate.toISOString(), // required ISO8601Timestamp
      endDate: today.toISOString(), // required ISO8601Timestamp
      bucketUnit: BucketUnit.DAY,
      bucketInterval: 1, // optional - default 1.
    };
    const res = await GoogleFit.getBloodPressureSamples(opt);
    let data = res.reverse();
    console.log(data);
    if (res.length === 0) {
      setBloodPressure({diastolic: 'Not Found', systolic: 'Not Found'});
    } else {
      setBloodPressure({
        diastolic: data[0].diastolic,
        systolic: data[0].systolic,
      });
    }
  };

  const fetchSteps = async () => {
    const opt = {
      startDate: lastWeekDate.toISOString(),
      endDate: today.toISOString(),
      bucketUnit: BucketUnit.DAY,
      bucketInterval: 1,
    };

    const res = await GoogleFit.getDailyStepCountSamples(opt);
    console.log(res);
    if (res.length !== 0) {
      for (var i = 0; i < res.length; i++) {
        if (res[i].source === 'com.google.android.gms:estimated_steps') {
          let data = res[i].steps.reverse();
          // let dailyStepCount = res[i].steps;
          setdailySteps(data[0].value);
        }
      }
    } else {
      console.log('Not Found');
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Weight">
            <Button title="fetch" onPress={fetchWeight} /> {weight}kg
          </Section>
          <Section title="HeartRate">
            <Button title="fetch" onPress={fetchHeartRate} /> {heartRate}
          </Section>
          <Section title="BloodPressure">
            <Button title="fetch" onPress={fetchBloodPressure} />
            {bloodPressure.systolic} / {bloodPressure.diastolic}
          </Section>
          <Section title="Steps">
            <Button title="fetch" onPress={fetchSteps} />
            {dailySteps} steps
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
