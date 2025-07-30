"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import CustomCheckbox from "@/app/components/forms/theme-elements/CustomCheckbox";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import { LoginUser } from "@/store/apps/user/UserSlice";


const AuthLogin = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [mobile, setMobile] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mobile || !pwd) {
      toast.error("Please enter both mobile and password");
      return;
    }

    setLoading(true);
    try {
      const resultAction = await dispatch(LoginUser({ baseUrl, mobile, pwd })).unwrap();      
     if (resultAction.success_key === 1) {
        toast.success("✅ Login successful!");
        sessionStorage.setItem('sid', resultAction.sid);
        sessionStorage.setItem('api_secret', resultAction.api_secret);
        sessionStorage.setItem('user_id', resultAction.email);
        sessionStorage.setItem('api_key', resultAction.api_key);
        sessionStorage.setItem('username', resultAction.username);
        router.push('/');
      } else {
        toast.error(resultAction.message || "Login failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", textAlign: "center", mb: 2 }}>
        <Typography fontWeight="600" variant="h5">
          KEJAPAY CRM
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Box>
            <CustomFormLabel htmlFor="mobile">Mobile</CustomFormLabel>
            <CustomTextField
              id="mobile"
              variant="outlined"
              fullWidth
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </Box>

          <Box>
            <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
            <CustomTextField
              id="password"
              type="password"
              variant="outlined"
              fullWidth
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
          </Box>
          <Stack justifyContent="space-between" direction="row" alignItems="center" my={1}>
            <FormGroup>
              <FormControlLabel
                control={<CustomCheckbox defaultChecked />}
                label="Remember this Device"
              />
            </FormGroup>
            <Typography
              component={Link}
              href="/auth/forgot-password"
              fontWeight="500"
              sx={{ textDecoration: "none", color: "primary.main" }}
            >
              Forgot Password?
            </Typography>
          </Stack>
          <Box>
            <Button
              color="primary"
              variant="contained"
              size="large"
              fullWidth
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </Box>
        </Stack>
      </form>
    </>
  );
};

export default AuthLogin;
