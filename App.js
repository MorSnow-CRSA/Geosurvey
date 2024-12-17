import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View,Image, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

// old screens
import StationStatus from './screens/old/StationStatus';
import UpdateStation from './screens/old/UpdateStation';
import NotesList from './screens/old/NotesList';
import AddStation from './screens/old/AddStation';
// import StationDetails from './screens/old/StationDetails';
import AddEquipment from './screens/old/AddEquipment';


// new screens
import Login from './screens/Login';
import HomeScreen from './screens/HomeScreen';
import StationsScreen from './screens/StationsScreen';
import Reservations from './screens/Reservations';
import Notifications from './screens/Notifications';
import StationsState from './screens/StationsState';
import AddNote from './screens/AddNote';
import StationDetails from './screens/StationDetails';
import EquipmentDetails from './screens/EquipmentDetails';
import ViewNotes from './screens/ViewNotes';
import DroneReservation from './screens/DroneReservation';


export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');
  const [back, setBack] = useState(null);
  const [stationId, setStationId] = useState(null);
  const [equipmentId, setEquipmentId] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [online, setOnline] = useState(false);
  const [modalContent, setModalContent] = useState(null);

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
      setOnline(isReachable);
    const interval = setInterval(async () => {
      const isReachable = await checkInternetConnection();
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
    {page!=="home"&& (
      <Pressable 
        style={styles.backButton} 
        onPress={() => setPage(back)}
      >
        <Text style={styles.backArrow}>←</Text>
      </Pressable>
    )}
      
      {user && (page === "home" && <HomeScreen setPage={setPage} setBack={setBack} user={user} ModalContent={modalContent} setModalContent={setModalContent}/>)}
      {user && (page === "Station" && <StationsScreen setPage={setPage} setBack={setBack} modalContent={modalContent} setModalContent={setModalContent}/>)}
      {user && (page === "StationDetails" && <StationDetails setPage={setPage} setBack={setBack} stationId={stationId} setEquipmentId={setEquipmentId} />)}
      {user && (page === "StationState" && <StationsState setPage={setPage} setBack={setBack} setStationId={setStationId} />)}
      {user && (page === "addNote" && <AddNote setPage={setPage} setBack={setBack} user={user} modalContent={modalContent} setModalContent={setModalContent} />)}
      {user && (page === "EquipmentDetails" && <EquipmentDetails setPage={setPage} setBack={setBack} stationId={stationId} equipment={equipmentId} />)}
      {user && (page === "viewNotes" && <ViewNotes setPage={setPage} setBack={setBack} />)}
      {user && (page === "Notifications" && <Notifications setPage={setPage} setBack={setBack} />)}
      {user && (page === "Drone" && <DroneReservation setPage={setPage} setBack={setBack} user={user} setModalContent={setModalContent} />)}
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
    paddingTop:60
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
    marginTop: 50,
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
  arrow: {
    fontSize: 24,
    color: '#1a3875',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  backArrow: {
    fontSize: 30,
    color: 'white',
  },
});
