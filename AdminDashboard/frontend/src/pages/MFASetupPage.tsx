import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Button, TextField } from "@mui/material";

const MFASetupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const id = searchParams.get("id");

  useEffect(() => {
    const tempToken = localStorage.getItem("tempToken");
    if (!tempToken || !id) {
      navigate("/login");
      return;
    }

    const fetchQrCode = async () => {
      const tempToken = localStorage.getItem("tempToken");
      if (!tempToken) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:5000/auth/admin/totp-setup",
          {},
          {
            headers: {
              Authorization: `Bearer ${tempToken}`,
            },
          }
        );
        setQrCodeUrl(response.data.qrCodeUrl);
      } catch (error) {
        console.error("MFA setup error:", error);
        navigate("/login");
      }
    };
    fetchQrCode();
  }, [id, navigate]); //dependencies

  const handleVerify = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/admin/verify-totp",
        { id, token }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.removeItem("tempToken");

      navigate("/dashboard");
    } catch (error: any) {
      setMessage(
        error.response?.data.message || "Invalid token. Please try again."
      );
    }
  };

  if (!id) {
    return <p>Invalid request :|</p>;
  }

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" color="primary">
          2FA Setup
        </Typography>
        <Typography sx={{ mt: 2 }} color="gray">
          Scan the QR code with your authenticator app and enter the code to
          verify.
        </Typography>
        {qrCodeUrl && (
          <img src={qrCodeUrl} alt="QR Code" style={{ marginTop: "20px" }} />
        )}
        <TextField
          margin="normal"
          fullWidth
          label="2FA Code"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button
          onClick={handleVerify}
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
        >
          Verify and Log In
        </Button>
        {message && (
          <Typography color="error" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default MFASetupPage;
