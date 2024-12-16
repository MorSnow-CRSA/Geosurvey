import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View,Image, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import Login from './screens/Login';
import HomeScreen from './screens/HomeScreen';
import StationsScreen from './screens/StationsScreen';
import AddStation from './screens/old/AddStation';
import StationDetails from './screens/old/StationDetails';
import AddEquipment from './screens/old/AddEquipment';
import AddNote from './screens/old/AddNote';
import StationStatus from './screens/old/StationStatus';
import UpdateStation from './screens/old/UpdateStation';
import NotesList from './screens/old/NotesList';
import Notifications from './screens/Notifications';
import {pendingOperationsQueue } from './firestore';
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [back, setBack] = useState(null);
  const [stationId, setStationId] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [online, setOnline] = useState(false);
  const [navigationParams, setNavigationParams] = useState(null);


  const checkInternetConnection = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // Abort after 2s

    try {
      const response = await fetch('https://8.8.8.8', { // Google's DNS server
        mode: 'no-cors',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      clearTimeout(timeoutId);
      return false;
    }
  };

  useEffect(() => {
    const isReachable =  checkInternetConnection();
      console.log("isReachable", isReachable); // Debug log
      setOnline(isReachable);
    const interval = setInterval(async () => {
      const isReachable = await checkInternetConnection();
      console.log("isReachable", isReachable); // Debug log
      setOnline(isReachable);
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, []); // Remove dependency array to ensure continuous monitoring

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
    // await AsyncStorage.removeItem('user');
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
      {!online && (
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, styles.statusOffline]} />
          <Text style={styles.statusText}>
            Offline
          </Text>
        </View>
      )}
      
      {user && (page === "home" && <HomeScreen setPage={setPage} setBack={setBack} user={user} />)}
      {user && (page === "Station" && <StationsScreen setPage={setPage} setBack={setBack} setStationId={setStationId} navigationParams={navigationParams} setNavigationParams={setNavigationParams}/>)}
      {user && (page === "AddStation" && <AddStation setPage={setPage} setBack={setBack} setNavigationParams={setNavigationParams}/>)}
      {user && (page === "StationDetails" && <StationDetails setPage={setPage} setBack={setBack} stationId={stationId} />)}
      {user && (page === "Add equipment" && <AddEquipment setPage={setPage} setBack={setBack} stationId={stationId} />)}
      {user && (page === "Add note" && <AddNote setPage={setPage} setBack={setBack} stationId={stationId} user={user} />)}
      {user && (page === "Status" && <StationStatus setPage={setPage} setBack={setBack} stationId={stationId} />)}
      {user && (page === "View notes" && <NotesList setPage={setPage} setBack={setBack} stationId={stationId} />)}
      {user && (page === "Update station" && <UpdateStation setPage={setPage} setBack={setBack} stationId={stationId} />)}
      {user && (page === "Notifications" && <Notifications setPage={setPage} setBack={setBack} />)}
      {!user && <Login setUser={setUser} online={online} />} 
      
      {user && (
        <View style={styles.bottomNav}>
          <Pressable 
            style={styles.bottomNavItem}
            onPress={() => {setActiveTab('notifications'); setPage('Notifications'); }}
          >
            <MaterialCommunityIcons 
              name="bell-outline" 
              style={styles.bottomNavIcon}
              borderTopColor={activeTab === 'notifications' ? '#1a3875' : '#8E8E93'} 
              borderTopWidth={activeTab === 'notifications' ? 2 : 0}
            />
          </Pressable>
          <Pressable 
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
          </Pressable>
          <Pressable 
            style={styles.bottomNavItem}
            onPress={() => {
              setActiveTab('profile');
              logout();
            }}
          >
            <MaterialCommunityIcons 
              name="logout" 
              style={styles.bottomNavIcon}
            />
          </Pressable>
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
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusOnline: {
    backgroundColor: '#4CAF50',
  },
  statusOffline: {
    backgroundColor: '#F44336',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});
