import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View,Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import Login from './screens/Login';
import HomeScreen from './screens/HomeScreen';
import StationsScreen from './screens/StationsScreen';
import AddStation from './screens/AddStation';
import StationDetails from './screens/StationDetails';
import AddEquipment from './screens/AddEquipment';
import AddNote from './screens/AddNote';
import StationStatus from './screens/StationStatus';

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [back, setBack] = useState(null);
  const [stationId, setStationId] = useState(null);

  const getUser = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        return JSON.parse(user);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Failed to retrieve the user', error);
      return null;
    }
  };
  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
    setPage('home');
  };
  useEffect(()=>{
    async function fetchUser() {
      const user = await getUser();
      console.log("user ", user);
      setUser(user);
    }
    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      {user && (
        <View style={styles.navigationBar}>
          {back && (
          <TouchableOpacity onPress={() => setPage(back)} style={styles.navItem}>
            <MaterialCommunityIcons name="arrow-left-bold-circle-outline" size={24} color='#ffffff' />
          </TouchableOpacity>
          )}
          <View style={{ alignSelf: 'center', width: '200px' }}>
            <TouchableOpacity onPress={() => {setPage('home'); setBack(null)}}>
              <Image
                source={require('./assets/images/logo-2.png')} 
                // style={{ width: '100px', maxHeight: '100px' }}
                onError={(error) => console.log('Image Load Error:', error)}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => logout()} style={styles.navItem}>
            <MaterialCommunityIcons name="logout" size={24} color='#ffffff' />
          </TouchableOpacity>
        </View>
      )}
      
      {user && (page === "home" && <HomeScreen setPage={setPage} setBack={setBack} />)}
      {user && (page === "Stations" && <StationsScreen setPage={setPage} setBack={setBack} setStationId={setStationId}/>)}
      {user && (page === "AddStation" && <AddStation setPage={setPage} setBack={setBack}  />)}
      {user && (page === "StationDetails" && <StationDetails setPage={setPage} setBack={setBack} stationId={stationId} />)}
      {user && (page === "Add equipment" && <AddEquipment setPage={setPage} setBack={setBack} stationId={stationId} />)}
      {user && (page === "Add note" && <AddNote setPage={setPage} setBack={setBack} stationId={stationId} user={user} />)}
      {user && (page === "StationStatus" && <StationStatus setPage={setPage} setBack={setBack} stationId={stationId} />)}
      {!user && <Login setUser={setUser}/>}       
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#2B2F77',
  },
  navItem: {
    padding: 10,
  }
});
