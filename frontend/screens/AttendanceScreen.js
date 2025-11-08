import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { getEventAttendees, markAttendance } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AttendanceScreen = ({ route, navigation }) => {
  const { eventId, eventTitle } = route.params;
  const [attendees, setAttendees] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
    loadAttendees();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadAttendees = async () => {
    try {
      setLoading(true);
      const response = await getEventAttendees(eventId);
      setAttendees(response.data.attendees);
      setStatistics(response.data.statistics);
    } catch (error) {
      console.error('Error loading attendees:', error);
      Alert.alert('Error', error.message || 'Failed to load attendees');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAttendees();
    setRefreshing(false);
  };

  const handleToggleAttendance = async (studentId, currentStatus, studentName) => {
    Alert.alert(
      'Mark Attendance',
      `${currentStatus ? 'Unmark' : 'Mark'} ${studentName} as ${currentStatus ? 'absent' : 'present'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await markAttendance(eventId, studentId, !currentStatus, 'manual');
              Alert.alert('Success', `Attendance ${currentStatus ? 'unmarked' : 'marked'} successfully`);
              loadAttendees();
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to update attendance');
            }
          },
        },
      ]
    );
  };

  const handleScanQR = () => {
    navigation.navigate('QRScanner', { 
      eventId,
      eventTitle,
      fromAttendance: true 
    });
  };

  const filteredAttendees = attendees.filter((item) => {
    const student = item.student;
    const query = searchQuery.toLowerCase();
    return (
      student?.name?.toLowerCase().includes(query) ||
      student?.email?.toLowerCase().includes(query) ||
      student?.usn?.toLowerCase().includes(query)
    );
  });

  const renderAttendeeItem = ({ item }) => {
    const student = item.student;
    if (!student) return null;

    return (
      <View style={styles.attendeeCard}>
        <View style={styles.attendeeInfo}>
          <View style={styles.attendeeHeader}>
            <Text style={styles.attendeeName}>{student.name}</Text>
            <TouchableOpacity
              style={[
                styles.statusBadge,
                item.attended ? styles.statusPresent : styles.statusAbsent,
              ]}
              onPress={() => handleToggleAttendance(student._id, item.attended, student.name)}
            >
              <Ionicons
                name={item.attended ? 'checkmark-circle' : 'time-outline'}
                size={18}
                color={item.attended ? '#10B981' : '#F59E0B'}
              />
              <Text
                style={[
                  styles.statusText,
                  item.attended ? styles.statusPresentText : styles.statusAbsentText,
                ]}
              >
                {item.attended ? 'Present' : 'Absent'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.attendeeDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="mail-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.detailText}>{student.email}</Text>
            </View>
            {student.usn && (
              <View style={styles.detailRow}>
                <Ionicons name="card-outline" size={14} color={COLORS.textSecondary} />
                <Text style={styles.detailText}>{student.usn}</Text>
              </View>
            )}
            {student.department && (
              <View style={styles.detailRow}>
                <Ionicons name="business-outline" size={14} color={COLORS.textSecondary} />
                <Text style={styles.detailText}>{student.department}</Text>
              </View>
            )}
          </View>

          {item.attended && item.attendedAt && (
            <View style={styles.checkInInfo}>
              <Ionicons name="time-outline" size={12} color={COLORS.textLight} />
              <Text style={styles.checkInText}>
                Checked in: {new Date(item.attendedAt).toLocaleString()}
              </Text>
              {item.checkInMethod && (
                <View style={styles.methodBadge}>
                  <Ionicons
                    name={item.checkInMethod === 'qr-scan' ? 'qr-code' : 'create-outline'}
                    size={12}
                    color={COLORS.textLight}
                  />
                  <Text style={styles.methodText}>
                    {item.checkInMethod === 'qr-scan' ? 'QR Scan' : 'Manual'}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading attendees...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Statistics */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{eventTitle}</Text>
        {statistics && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{statistics.totalRSVPs}</Text>
              <Text style={styles.statLabel}>Total RSVPs</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: '#10B981' }]}>
                {statistics.attendedCount}
              </Text>
              <Text style={styles.statLabel}>Present</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: '#F59E0B' }]}>
                {statistics.pendingCount}
              </Text>
              <Text style={styles.statLabel}>Absent</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: COLORS.primary }]}>
                {statistics.attendanceRate}%
              </Text>
              <Text style={styles.statLabel}>Rate</Text>
            </View>
          </View>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, email or USN..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.textLight}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Scan QR Button */}
      <TouchableOpacity style={styles.scanButton} onPress={handleScanQR}>
        <Ionicons name="qr-code-outline" size={24} color="white" />
        <Text style={styles.scanButtonText}>Scan QR to Mark Attendance</Text>
      </TouchableOpacity>

      {/* Attendees List */}
      <FlatList
        data={filteredAttendees}
        renderItem={renderAttendeeItem}
        keyExtractor={(item) => item.student._id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={COLORS.textLight} />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No attendees found matching your search' : 'No attendees yet'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  header: {
    backgroundColor: 'white',
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    ...SHADOWS.medium,
  },
  scanButtonText: {
    ...TYPOGRAPHY.button,
    color: 'white',
    marginLeft: SPACING.sm,
  },
  listContent: {
    padding: SPACING.md,
  },
  attendeeCard: {
    backgroundColor: 'white',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  attendeeInfo: {
    flex: 1,
  },
  attendeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  attendeeName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    gap: 4,
  },
  statusPresent: {
    backgroundColor: '#10B98120',
  },
  statusAbsent: {
    backgroundColor: '#F59E0B20',
  },
  statusText: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  statusPresentText: {
    color: '#10B981',
  },
  statusAbsentText: {
    color: '#F59E0B',
  },
  attendeeDetails: {
    marginTop: SPACING.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  detailText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  checkInInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 6,
    flexWrap: 'wrap',
  },
  checkInText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    fontSize: 11,
  },
  methodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    marginLeft: 'auto',
    gap: 4,
  },
  methodText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    fontSize: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textLight,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
});

export default AttendanceScreen;
