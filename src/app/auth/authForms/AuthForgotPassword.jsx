'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import toast from 'react-hot-toast';
import Link from 'next/link';

import CustomTextField from '@/app/components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '@/app/components/forms/theme-elements/CustomFormLabel';
import { useRouter } from 'next/navigation';
import { ForgotPassword, ResetPassword } from '@/store/apps/user/UserSlice';

export default function AuthForgotPassword() {
  const dispatch = useDispatch();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleForgotPassword = async () => {
    if (!mobileNumber) {
      toast.error('Please enter your mobile number.');
      return;
    }

    setLoading(true);

    try {
      const resultAction = await dispatch(
        ForgotPassword({ baseUrl, mobile_number: mobileNumber }),
      ).unwrap();
      if (resultAction.success === true) {
        toast.success(resultAction.message || 'OTP sent successfully');
        setOtpSent(true);
      } else {
        toast.error(resultAction.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeOTP = (index, value) => {
    if (/^\d?$/.test(value)) {
      const updated = [...otpDigits];
      updated[index] = value;
      setOtpDigits(updated);
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleResetPassword = async () => {
    const otp = otpDigits.join('');
    if (otp.length !== 4) {
      toast.error('Please enter the full 4-digit OTP.');
      return;
    }
    if (!newPassword) {
      toast.error('Please enter a new password.');
      return;
    }
    setLoading(true);
    try {
      const result = await dispatch(
        ResetPassword({
          baseUrl,
          mobile_number: mobileNumber,
          otp,
          new_password: newPassword,
        }),
      ).unwrap();
      if (result.success === true) {
        toast.success(result.message || 'Password reset successfully');
        router.push('/');
      } else {
        toast.error(result.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack mt={4} spacing={2}>
      {!otpSent && (
        <Box>
          <CustomFormLabel htmlFor="reset-mobile">Mobile Number</CustomFormLabel>
          <CustomTextField
            id="reset-mobile"
            variant="outlined"
            fullWidth
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Enter your mobile number"
            disabled={otpSent}
          />
        </Box>
      )}

      {!otpSent && (
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleForgotPassword}
          disabled={loading}
        >
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </Button>
      )}

      {otpSent && (
        <>
          <CustomFormLabel>Enter OTP</CustomFormLabel>
          <Grid container spacing={2}>
            {otpDigits.map((digit, idx) => (
              <Grid item xs={3} key={idx}>
                <CustomTextField
                  id={`otp-${idx}`}
                  value={digit}
                  onChange={(e) => handleChangeOTP(idx, e.target.value)}
                  inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                  autoFocus={idx === 0}
                />
              </Grid>
            ))}
          </Grid>

          <CustomFormLabel>New Password</CustomFormLabel>
          <CustomTextField
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </>
      )}

      <Button color="primary" size="large" fullWidth component={Link} href="/auth/login">
        Back to Login
      </Button>
    </Stack>
  );
}
