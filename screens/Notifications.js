import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import {  collection, query, where, orderBy, getDocs, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firestore';
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const userEmail = auth.currentUser?.email;
      if (!userEmail) return;
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('email', '==', userEmail),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const notificationsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // turn notifications as seen
      querySnapshot.docs.forEach((doc) => {
        if (!doc.data().seen) {  // Only update if not already seen
          updateDoc(doc.ref, {
            seen: true
          });
        }
      });

      setNotifications(notificationsList);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderNotification = ({ item }) => (
    <View style={item.seen ? styles.seenNotification : styles.notificationItem}>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.timestamp}>
        {item.createdAt?.toDate().toLocaleDateString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.noNotifications}>No notifications</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a3875',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  notificationItem: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  seenNotification: {
    backgroundColor: '#a5a5a5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a3875',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#1a3875',
  },
  noNotifications: {
    fontSize: 24,
    color: '#ffffff',
  },
});

export default Notifications;