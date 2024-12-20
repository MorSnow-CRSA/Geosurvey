import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform } from 'react-native';
import { db, storage } from '../../firestore.js';
import { collection,GeoPoint, updateDoc,getDoc, doc } from 'firebase/firestore'; 
import { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import { ref, uploadBytesResumable, getDownloadURL  } from 'firebase/storage';

const UpdateStation = ({setPage, setBack, stationId  }) => {
    setBack("Stations");
    const [name, setName] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [image, setImage] = useState("");
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [extension, setExtension] = useState("");


    const handleSave =  async () => {
        try {
            const url = await uploadImage(image);
            const data ={
                name:name,
                coordinates: new GeoPoint(latitude, longitude),
                image:url,
                date:date,
              }
            const docRef = doc(collection(db, "station"), stationId);
            await updateDoc(docRef,data);
          setPage("Stations", { showSuccessPopup: true }); 

        } catch (e) {
          console.error("Error adding document: ", e);
        }
      };
      
    const getStationInfo = async () => {
        const docRef = doc(collection(db, "station"), stationId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setName(docSnap.data().name);
            setLatitude(docSnap.data().coordinates.latitude);
            setLongitude(docSnap.data().coordinates.longitude);
            setImage(docSnap.data().image);
            setDate(new Date(docSnap.data().date.toDate()));
        }
    };
    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const formatDate = (date) => {
        if (date instanceof Date) {
            return date.toLocaleDateString();
        }
        return 'Select a date';
    };
    const handleWebDateTimeChange = (event) => {
        console.log(event.target.value);
        try {
            setDate(new Date(event.target.value));
        } catch (error) {
            console.error("Error setting date time: ", error);
        }
    };

    useEffect(() => {
        getStationInfo();
    }, []);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            allowsMultipleSelection: false,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            l = result.assets[0].uri.split(".")
            setExtension(l[l.length-1]);
        }
    };

    const uploadImage = async (uri) => {        
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(storage, `images/${new Date().getTime()}.${extension}`);
        const uploadTask = await uploadBytesResumable(storageRef, blob);
        const url = await getDownloadURL(uploadTask.ref);
        return url;
        
    };


  return (
    <View style={styles.stationsContainer}>

        <View style={styles.inputContainer}>
            <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#fff"
            value={name}    
            onChangeText={(text) => setName(text)}
            />
        
        </View>
        <View style={styles.inputContainer}>
                {Platform.OS === 'web' ? (
                    <input
                        type="date"
                        value={date.toISOString().split('T')[0]}
                        onChange={handleWebDateTimeChange}
                        style={{
                            ...styles.input,
                            backgroundColor: 'transparent',
                            color: '#fff',
                            border: 'none',
                        }}
                    />
                ) : Platform.OS === 'ios' ? (
                    <DateTimePicker
                        style={styles.input}
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                ) : (
                    <>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={{ color: '#fff' }}>
                                {formatDate(date)}
                            </Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                            />
                        )}
                    </>
                )}
        </View>

        <View style={styles.inputContainer}>
            <TextInput
                keyboardType="decimal-pad"
                style={styles.input}
                placeholder="Latitude"
                placeholderTextColor="#fff"
                value={latitude}
                onChangeText={(text) => {
                    // Allow only numbers, one decimal point, and optional minus sign at the start
                    const numericValue = text.replace(/[^0-9.-]/g, '')
                                            .replace(/(\..*)\./g, '$1')
                                            .replace(/(?!^)-/g, '')
                                            .replace(/^(-?\d+\.\d{6}).*$/, '$1');
                    setLatitude(numericValue);
                }}
            />
        </View>

        <View style={styles.inputContainer}>
            <TextInput
                keyboardType="decimal-pad"
                style={styles.input}
                placeholder="Longitude"
                placeholderTextColor="#fff"
                value={longitude}
                onChangeText={(text) => {
                    // Allow only numbers, one decimal point, and optional minus sign at the start
                    const numericValue = text.replace(/[^0-9.-]/g, '')
                                            .replace(/(\..*)\./g, '$1')
                                            .replace(/(?!^)-/g, '')
                                            .replace(/^(-?\d+\.\d{6}).*$/, '$1');
                    setLongitude(numericValue);
                }}
            />
        </View>

        <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                    <Text style={styles.imagePickerText}>
                        {image ? 'Change Image' : 'Select Image'}
                    </Text>
                </TouchableOpacity>
                {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
        </View>

    <TouchableOpacity style={styles.addButton} onPress={handleSave}>
        <Text style={styles.addButtonText}>Save</Text>
    </TouchableOpacity>

      
    </View>
  );
};

const styles = StyleSheet.create({
    stationsContainer: {
    flex: 1,
    backgroundColor: '#2B2F77',
    paddingTop: 80,
    paddingHorizontal: 20,
    width: '100%',
  },
  addButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 0,
  },
  addButtonText: {
    color: '#2B2F77',
    fontSize: 18,
    fontWeight: 'bold',
  },
  latestReportsText: {
    fontSize: 16,
    marginBottom: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  reportCard: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#21437f',
    padding: 15,
    borderRadius: 25,
    marginBottom: 15,
    width: '48%',
    color: '#21437f',
  },
  reportInfo: {
    flex: 1,
  },
  stationName: {
    color: '#21437f',
    fontSize: 16,
    marginBottom: 5,
  },
  lastUpdate: {
    color: 'white',
    fontSize: 14,
  },
  iconWrapper: {
    paddingLeft: 10,
  },
  reportIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  carIcon: {
    marginBottom: 5,
  },  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4D5398',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    width: '100%',
  },
  input: {
    flex: 1,
    color: 'white',
    paddingLeft: 10,
  },
  imagePickerButton: {
    backgroundColor: '#4D5398',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    },
    imagePickerText: {
        color: '#fff',
        textAlign: 'center',
    },
    imagePreview: {
        width: 100,
        height: 100,
        marginTop: 10,
        borderRadius: 5,
    },
});

export default UpdateStation;