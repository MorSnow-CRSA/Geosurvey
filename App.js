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
import UpdateStation from './screens/UpdateStation';
import NotesList from './screens/NotesList';

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [back, setBack] = useState(null);
  const [stationId, setStationId] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

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
      setUser(user);
    }
    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      {user && (page === "home" && <HomeScreen setPage={setPage} setBack={setBack} user={user} />)}
      {user && (page === "Station" && <StationsScreen setPage={setPage} setBack={setBack} setStationId={setStationId}/>)}
      {user && (page === "AddStation" && <AddStation setPage={setPage} setBack={setBack}  />)}
      {user && (page === "StationDetails" && <StationDetails setPage={setPage} setBack={setBack} stationId={stationId} />)}
      {user && (page === "Add equipment" && <AddEquipment setPage={setPage} setBack={setBack} stationId={stationId} />)}
      {user && (page === "Add note" && <AddNote setPage={setPage} setBack={setBack} stationId={stationId} user={user} />)}
      {user && (page === "Status" && <StationStatus setPage={setPage} setBack={setBack} stationId={stationId} />)}
      {user && (page === "View notes" && <NotesList setPage={setPage} setBack={setBack} stationId={stationId} />)}
      {user && (page === "Update station" && <UpdateStation setPage={setPage} setBack={setBack} stationId={stationId} />)}
      
      {!user && <Login setUser={setUser}/>} 
      
      {user && (
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={styles.bottomNavItem}
            onPress={() => setActiveTab('notifications')}
          >
            <MaterialCommunityIcons 
              name="bell-outline" 
              style={styles.bottomNavIcon}
              borderTopColor={activeTab === 'notifications' ? '#1a3875' : '#8E8E93'} 
              borderTopWidth={activeTab === 'notifications' ? 2 : 0}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.bottomNavItem}
            onPress={() => {
              setActiveTab('home');
              setPage('home');
            }}
          >
            <MaterialIcons 
              name="home" 
              style={styles.bottomNavIcon}
              borderTopColor={activeTab === 'home' ? '#1a3875' : '#8E8E93'} 
              borderTopWidth={activeTab === 'home' ? 2 : 0}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.bottomNavItem}
            onPress={() => setActiveTab('profile')}
          >
            <MaterialCommunityIcons 
              name="account-outline" 
              style={styles.bottomNavIcon}
              borderTopColor={activeTab === 'profile' ? '#1a3875' : '#8E8E93'} 
              borderTopWidth={activeTab === 'profile' ? 2 : 0}
            />
          </TouchableOpacity>
        </View>
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a3875',
    width: '100%',
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#2b4b9a',
  },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 30,
    shadowColor: '#000',
    width: '90%',
    alignSelf: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomNavItem: {
    alignItems: 'center',
    paddingTop: '10px',
    paddingHorizontal: '20px',
    color:"#1a3875"
  },
  bottomNavIcon: {
    size: 24,
    fontWeight: 'bold',
    fontSize: 24,
    color: "#1a3875"
  }
});
