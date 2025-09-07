import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CircularProgress,
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AttendanceUserCard from '../components/AttendanceUserCard';
import AttendanceStats from '../components/AttendanceStats';
import {
  scanAttendance,
  saveAttendance,
  getAttendanceStats,
} from '../services/attendanceService';
import {
  AttendanceUser,
  AttendanceStats as StatsType,
} from '../types/attendanceTypes';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { QrReader } from 'react-qr-reader';
import type { Result } from '@zxing/library';

const AttendanceScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [userData, setUserData] = useState<AttendanceUser | null>(null);
  const [stats, setStats] = useState<StatsType | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
        setDevices(mediaDevices.filter(device => device.kind === 'videoinput'));
      });
    }
  }, []);

  // Always fetch stats for today, no preschoolId needed
  const fetchStats = async () => {
    try {
      const today = new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD' in local time
      const res = await getAttendanceStats(today);
      setStats(res);
    } catch {}
  };

  const handleScan = async (code?: string) => {
    setErrorMsg('');
    setSuccessMsg('');
    setUserData(null);
    setScanning(true);

    let qrValue = code ?? qrCode;
    if (!qrValue) {
      setErrorMsg('Please enter a QR code value.');
      setScanning(false);
      return;
    }
    let qrObj;
    try {
      qrObj = JSON.parse(qrValue);
    } catch {
      try {
        const lines = qrValue
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);
        const obj: any = {};
        lines.forEach(line => {
          const [key, ...rest] = line.split(':');
          if (key && rest.length > 0) {
            obj[key.trim()] = rest.join(':').trim().replace(/,$/, '');
          }
        });
        if (obj.id) obj.id = Number(obj.id);
        if (obj.role) obj.role = Number(obj.role);
        qrObj = obj;
      } catch {
        setErrorMsg('Invalid QR code format.');
        setScanning(false);
        return;
      }
    }
    try {
      const res = await scanAttendance(qrObj);
      setStats(res.stats); // Update stats from response

      if (res.status === 'success') {
        const scanTime = res.user.scanTime
          ? res.user.scanTime
          : new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });
        setUserData({
          ...res.user,
          scanTime,
          preschool_id: res.user.preschool_id,
        });
        setSuccessMsg(res.message); // <-- Show green toaster with API message
        setScanning(false);

        // Automatically save attendance after scan
        setTimeout(() => {
          handleSave();
        }, 500);

        setTimeout(() => {
          setUserData(null);
          setSuccessMsg('');
          setQrCode('');
        }, 2500);
      } else {
        // Failed scan (e.g., already marked, invalid user, etc.)
        setUserData(res.user || null);
        setErrorMsg(res.message || 'Scan failed');
        setScanning(false);

        setTimeout(() => {
          setUserData(null);
          setErrorMsg('');
          setQrCode('');
        }, 2500);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong');
      setScanning(false);
    }
  };

  const handleSave = async () => {
    if (!userData) return;
    setSaving(true);
    try {
      const result = await saveAttendance({
        userId: userData.id,
        date_: userData.date,
        status: 'Present',
      });

      // Compose the name for the message
      let name = '';
      const roleNum = typeof userData.role === 'string' ? parseInt(userData.role) : userData.role;
      if (roleNum === 2 && userData.firstName && userData.lastName) {
        name = `${userData.firstName} ${userData.lastName}`;
      } else if (roleNum === 3 && userData.firstName && userData.lastName) {
        name = `${userData.firstName} ${userData.lastName}`;
      } else if (userData.fullName) {
        name = userData.fullName;
      } else if (userData.firstName && userData.lastName) {
        name = `${userData.firstName} ${userData.lastName}`;
      } else if (userData.firstName) {
        name = userData.firstName;
      }

      setSaveSuccessMsg(
        `Attendance marked successfully for ${name}`
      );
      setSuccessMsg(result.message);

      await fetchStats();
    } catch (err: any) {
      setErrorMsg(err.message || 'Save failed');
    }
    setSaving(false);
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: 900, mx: 'auto' }}>
      {/* Header Section */}
      <Typography variant="h4" align="center" gutterBottom>
        Attendance Scanner
      </Typography>

      <Card
        sx={{
          border: 'none',
          boxShadow: 2,
          borderRadius: 3,
          mb: 3,
          p: 0,
          background: '#fff',
        }}
      >
        <Box
          sx={{
            border: '3px dashed #2196f3',
            borderRadius: 4,
            minHeight: 180,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 2, md: 6 },
            py: { xs: 3, md: 5 },
            background: '#f9fbfc',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Box
              sx={{
                bgcolor: '#ede7f6',
                borderRadius: '50%',
                width: 60,
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
              }}
            >
              <QrCodeScannerIcon sx={{ fontSize: 38, color: '#7c4dff' }} />
            </Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: '#222', textAlign: 'center' }}
            >
              Place ID Card Here
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: '#888', textAlign: 'center', mt: 0.5 }}
            >
              Ready to scan teacher or student card
            </Typography>
          </Box>
          
        </Box>
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-start', px: 3, py: 2 }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowScanner(true)}
            disabled={scanning}
            sx={{
              minWidth: 150,
              borderRadius: 8,
              fontWeight: 700,
              textTransform: 'none',
              boxShadow: 'none',
              fontSize: 16,
              px: 3,
              py: 1.2,
            }}
          >
            {scanning ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              'Start Scanning'
            )}
          </Button>
        </Box>
      </Card>

      {/* User Details and Success Message */}
      {userData && (
        <AttendanceUserCard
          user={userData}
          successMsg={successMsg}
          saving={saving}
          // onSave={handleSave} // REMOVE THIS PROP if you removed the Save button
        />
      )}

      {/* Stats Cards */}
      <AttendanceStats stats={stats} />

      {/* Snackbar for errors */}
      <Snackbar
        open={!!errorMsg}
        autoHideDuration={4000}
        onClose={() => setErrorMsg('')}
      >
        <Alert severity="error" onClose={() => setErrorMsg('')}>
          {errorMsg}
        </Alert>
      </Snackbar>
      {/* Snackbar for save success */}
      <Snackbar
        open={!!successMsg && !userData}
        autoHideDuration={2000}
        onClose={() => setSuccessMsg('')}
      >
        <Alert severity="success" onClose={() => setSuccessMsg('')}>
          {successMsg}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!saveSuccessMsg}
        autoHideDuration={3000}
        onClose={() => setSaveSuccessMsg('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSaveSuccessMsg('')}
          severity="success"
          sx={{ width: '100%' }}
        >
          {saveSuccessMsg}
        </Alert>
      </Snackbar>

      {/* QR Scanner Modal/Popup */}
      {showScanner && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ bgcolor: '#fff', p: 2, borderRadius: 2 }}>
            <Box sx={{ width: 300 }}>
              <select
                onChange={e => setDeviceId(e.target.value)}
                value={deviceId}
                style={{ marginBottom: 10 }}
              >
                <option value="">Select Camera</option>
                {devices.map((device, idx) => (
                  <option value={device.deviceId} key={device.deviceId}>
                    {device.label || `Camera ${idx + 1}`}
                  </option>
                ))}
              </select>
              <QrReader
                constraints={
                  deviceId
                    ? { deviceId: { exact: deviceId } }
                    : { facingMode: 'environment' }
                }
                onResult={(
                  result: Result | null | undefined,
                  error: Error | null | undefined
                ) => {
                  if (!!result) {
                    const scannedCode = result.getText();
                    setQrCode(scannedCode);
                    setShowScanner(false);
                    setTimeout(() => {
                      handleScan(scannedCode);
                    }, 100);
                  }
                  // Optionally handle error
                }}
              />
            </Box>
            <Button onClick={() => setShowScanner(false)} sx={{ mt: 2 }}>Close</Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AttendanceScanner;