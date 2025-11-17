import { useState, useEffect } from "react";
import webseederLogo from "figma:asset/dbec6477395e40f9a594682daf5e89e877d326cc.png";
import { slideshowImages } from "../assets/images";
import {
  isEmailRegistered,
  resetUserPassword,
  loginUser, // Keep this for now, or remove if auth.js provides all functions
} from "../lib/auth";
import { authService } from "../lib/api/services/authService";
import { toast } from "sonner@2.0.3";
import {
  projectId,
  publicAnonKey,
} from "../utils/supabase/info";
import { Shield, BarChart3, Palette, Rocket, Link2, Cloud, Mail, Hash, Clock, Lightbulb, Lock } from "lucide-react";

// Import your CSS file
import "../styles/login.css";

const slidesData = [
  {
    image: slideshowImages[0],
    title: "Welcome Back",
    subtitle: "Sign in to access your dashboard",
    features: [
      {
        icon: Shield,
        heading: "Secure Access",
        description:
          "Your data is protected with enterprise-grade security",
      },
      {
        icon: BarChart3,
        heading: "Real-time Analytics",
        description:
          "Monitor your performance with live data insights",
      },
    ],
  },
  {
    image: slideshowImages[1],
    title: "Modern Interface",
    subtitle: "Experience our redesigned, intuitive platform",
    features: [
      {
        icon: Palette,
        heading: "Intuitive Design",
        description:
          "Navigate effortlessly with a user-friendly layout",
      },
      {
        icon: Rocket,
        heading: "Boost Productivity",
        description:
          "Streamline your workflows and achieve more",
      },
    ],
  },
  {
    image: slideshowImages[2],
    title: "Seamless Integration",
    subtitle: "Connect with your favorite tools effortlessly",
    features: [
      {
        icon: Link2,
        heading: "Easy Connectivity",
        description:
          "Integrate with third-party services seamlessly",
      },
      {
        icon: Cloud,
        heading: "Cloud-Powered",
        description:
          "Access your data anytime, anywhere with cloud support",
      },
    ],
  },
];

export function Login({ onLogin, onNavigate }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showForgotPassword, setShowForgotPassword] =
    useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(
    "email"
  );
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7c75f461`;

  // Test mode - set to true to bypass API and use local OTP storage
  // Enable this if you're having issues with the Supabase edge function
  // NOTE: When TEST_MODE is true, edge function 403 errors can be safely ignored
  const TEST_MODE = false; // TODO: Set to false when email service is working

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex(
        (prevIndex) => (prevIndex + 1) % slidesData.length,
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (
    e
  ) => {
    const value =
      e.target.type === "checkbox"
        ? e.target.checked
        : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter email and password");
      setLoading(false);
      return;
    }

    // Simulate API call delay
    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      // authService.login automatically stores the token.
      // We just need to tell the app we are logged in.
      if (response.success && response.data.user) {
        onLogin(response.data.user);
      } else {
        setError(response.message || "Invalid email or password.");
      }
    } catch (error) {
      // The apiClient will throw an error with a user-friendly message
      setError(error.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();

    console.log("handleSendOTP called, email:", forgotEmail);

    if (!forgotEmail || forgotEmail.trim() === "") {
      toast.error("Please enter your email address");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Check if email is registered
    const trimmedEmail = forgotEmail.trim();
    console.log(
      "Checking if email is registered:",
      trimmedEmail,
    );
    if (!isEmailRegistered(trimmedEmail)) {
      toast.error(
        "This email is not registered. Please use a registered email address.",
        {
          description:
            "You can only reset password for registered accounts.",
          duration: 5000,
        },
      );
      return;
    }

    setOtpSending(true);

    // Test mode fallback
    if (TEST_MODE) {
      const trimmedEmail = forgotEmail.trim();
      const testOTP = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      localStorage.setItem(
        `otp:${trimmedEmail}`,
        JSON.stringify({
          otp: testOTP,
          expiryTime: Date.now() + 5 * 60 * 1000,
        }),
      );

      console.log(
        "TEST MODE: Generated OTP:",
        testOTP,
        "for",
        trimmedEmail,
      );

      setTimeout(() => {
        toast.success(
          "OTP Generated Successfully! (Test Mode)",
          {
            description: `To: ${trimmedEmail}\nYour OTP Code: ${testOTP}\nValid for 5 minutes\n\nCopy this code to verify your email`,
            duration: 15000,
            important: true,
          },
        );
        console.log("═══════════════════════════════════");
        console.log("YOUR OTP CODE");
        console.log("═══════════════════════════════════");
        console.log("");
        console.log(`   ${testOTP}`);
        console.log("");
        console.log("═══════════════════════════════════");
        console.log("Select and copy the code above");
        console.log("Valid for 5 minutes");
        console.log("═══════════════════════════════════");
        setForgotPasswordStep("otp");
        setResendCooldown(60);
        setOtpSending(false);
      }, 1000);
      return;
    }

    try {
      const trimmedEmail = forgotEmail.trim();
      console.log(
        "Sending OTP request to:",
        `${API_URL}/send-otp`,
      );
      console.log("Email:", trimmedEmail);

      // Send OTP via API
      const response = await fetch(`${API_URL}/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      console.log("📡 Response status:", response.status);
      console.log("📡 Response ok:", response.ok);

      if (!response.ok) {
        console.error(
          "❌ HTTP Error:",
          response.status,
          response.statusText,
        );
        throw new Error(
          `Server returned ${response.status}: ${response.statusText}`,
        );
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (data.success) {
        console.log("OTP sent successfully!");
        if (data.testMode) {
          // In test mode, show the OTP directly
          toast.success(
            `OTP sent to ${trimmedEmail}! (Test Mode)`,
            {
              description: `Your OTP is: ${data.otp}\n\nNote: Email will be sent when Resend API is properly configured.`,
              duration: 10000,
            },
          );
        } else {
          toast.success(`OTP sent successfully!`, {
            description: `Please check your email inbox (${trimmedEmail}) including spam folder for the OTP code.`,
            duration: 8000,
          });
        }
        console.log("Moving to OTP verification step...");
        setForgotPasswordStep("otp");
        setResendCooldown(60); // 60 seconds cooldown before resend
      } else {
        console.error("❌ OTP sending failed:", data.error);
        toast.error(
          data.error || "Failed to send OTP. Please try again.",
          {
            duration: 6000,
          },
        );
      }
    } catch (error) {
      console.error("❌ Exception sending OTP:", error);
      console.error("❌ Error message:", error.message);
      toast.error(
        "Network error: Could not connect to server. Please check your connection.",
        {
          description: error.message,
          duration: 8000,
        },
      );
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    setOtpVerifying(true);

    // Test mode fallback
    if (TEST_MODE) {
      const trimmedEmail = forgotEmail.trim();
      const storedData = localStorage.getItem(
        `otp:${trimmedEmail}`,
      );

      if (!storedData) {
        toast.error("OTP not found or expired");
        setOtpVerifying(false);
        return;
      }

      const { otp: storedOTP, expiryTime } =
        JSON.parse(storedData);

      if (Date.now() > expiryTime) {
        localStorage.removeItem(`otp:${trimmedEmail}`);
        toast.error("OTP has expired");
        setOtpVerifying(false);
        return;
      }

      if (otp !== storedOTP) {
        toast.error("Invalid OTP. Please try again.");
        setOtpVerifying(false);
        return;
      }

      localStorage.removeItem(`otp:${trimmedEmail}`);
      toast.success("OTP verified successfully!");
      setForgotPasswordStep("reset");
      setOtpVerifying(false);
      return;
    }

    try {
      // Verify OTP via API
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          email: forgotEmail,
          otp: otp,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("OTP verified successfully!");
        setForgotPasswordStep("reset");
      } else {
        toast.error(
          data.error || "Invalid OTP. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleResendOTP = () => {
    if (resendCooldown > 0) {
      toast.error(
        `Please wait ${resendCooldown} seconds before resending`,
      );
      return;
    }

    setOtp("");
    handleSendOTP();
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    console.log("Reset password attempt for:", forgotEmail);

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        "Password must be at least 6 characters long",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Reset password in the system
    const trimmedEmail = forgotEmail.trim();
    console.log(
      "Calling resetUserPassword for:",
      trimmedEmail,
    );
    const success = resetUserPassword(
      trimmedEmail,
      newPassword,
    );

    console.log("Password reset result:", success);

    if (success) {
      toast.success(
        "Password reset successfully! You can now login with your new password.",
        {
          description: `Your password has been updated for ${trimmedEmail}`,
          duration: 5000,
        },
      );
      // Reset all states
      setShowForgotPassword(false);
      setForgotPasswordStep("email");
      setForgotEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setResendCooldown(0);
    } else {
      toast.error(
        "Failed to reset password. Please try again.",
      );
    }
  };

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotPasswordStep("email");
    setForgotEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setResendCooldown(0);
  };

  const currentSlide = slidesData[currentSlideIndex];

  return (
    <div className="login">
      <div className="loginContainer">
        <div className="illustrationSection">
          {slidesData.map((slide, index) => (
            <div
              key={index}
              className={`slide-background ${index === currentSlideIndex ? "active" : ""}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            ></div>
          ))}
          <div className="slideshow-content">
            <div className="logo">
              <h1>Dynasty Premium</h1>
            </div>
            <div className="welcomeMessage">
              <h2 className="slide-title">
                {currentSlide.title}
              </h2>
              <p className="slide-subtitle">
                {currentSlide.subtitle}
              </p>
            </div>
            <div className="features">
              {currentSlide.features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div className="feature" key={index}>
                    <div className="featureIcon">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="featureContent">
                      <h4>{feature.heading}</h4>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="formSection">
          <div className="formContent">
            {!showForgotPassword ? (
              <>
                <div className="header">
                  <img
                    src={webseederLogo}
                    alt="WebSeeder Logo"
                    className="login-logo"
                  />
                  <h1>Welcome Back</h1>
                  <p>Sign in to your account to continue</p>
                </div>

                {error && (
                  <div className="errorMessage">{error}</div>
                )}

                <form onSubmit={handleLogin}>
                  <div className="inputGroup">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="inputGroup">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <div className="formOptions">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                      />
                      <span>Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setShowForgotPassword(true)
                      }
                      className="forgotPassword"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="loginButton"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner"></div>
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                <div className="signupRedirect">
                  <p>
                    Don't have an account?{" "}
                    <button
                      onClick={() => onNavigate("signup")}
                      className="link"
                    >
                      Create Account
                    </button>
                  </p>
                </div>

                <div className="securityFooter">
                  <p>Secured by Dynasty Premium</p>
                </div>
              </>
            ) : (
              <>
                <div className="header">
                  <img
                    src={webseederLogo}
                    alt="WebSeeder Logo"
                    className="login-logo"
                  />
                  <h1>
                    {forgotPasswordStep === "email" &&
                      "Forgot Password"}
                    {forgotPasswordStep === "otp" &&
                      "Verify OTP"}
                    {forgotPasswordStep === "reset" &&
                      "Reset Password"}
                  </h1>
                  <p>
                    {forgotPasswordStep === "email" &&
                      "Enter your registered email to receive an OTP"}
                    {forgotPasswordStep === "otp" &&
                      "Enter the 6-digit OTP sent to your email"}
                    {forgotPasswordStep === "reset" &&
                      "Create a new strong password"}
                  </p>

                  {TEST_MODE && (
                    <div
                      style={{
                        background: "#FFF4E6",
                        border: "1px solid #FFB84D",
                        borderRadius: "8px",
                        padding: "12px",
                        marginTop: "12px",
                        fontSize: "0.85rem",
                        color: "#663C00",
                      }}
                    >
                      <strong>Test Mode Active</strong>
                      <p
                        style={{
                          margin: "4px 0 0 0",
                          fontSize: "0.8rem",
                        }}
                      >
                        Feature is fully working!
                        <br />
                        OTP will be shown in a notification
                        (no server needed)
                        <br />
                        Real emails: Optional - See
                        README_FORGOT_PASSWORD.md
                      </p>
                    </div>
                  )}
                </div>

                {forgotPasswordStep === "email" && (
                  <form
                    onSubmit={handleSendOTP}
                    style={{ marginTop: "20px" }}
                  >
                    <div className="inputGroup">
                      <label>Email Address</label>
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) =>
                          setForgotEmail(e.target.value)
                        }
                        placeholder="Enter your registered email"
                        required
                        autoFocus
                      />
                      <small
                        style={{
                          display: "block",
                          marginTop: "0.5rem",
                          color: "#666",
                          fontSize: "0.85rem",
                        }}
                      >
                        Only registered email addresses can
                        reset their password
                      </small>
                    </div>

                    <button
                      type="submit"
                      className="loginButton"
                      disabled={otpSending || !forgotEmail}
                      style={{
                        opacity:
                          otpSending || !forgotEmail ? 0.7 : 1,
                        cursor:
                          otpSending || !forgotEmail
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {otpSending ? (
                        <>
                          <div className="spinner"></div>
                          Sending OTP...
                        </>
                      ) : (
                        "Send OTP"
                      )}
                    </button>
                  </form>
                )}

                {forgotPasswordStep === "otp" && (
                  <form onSubmit={handleVerifyOTP}>
                    <div className="inputGroup">
                      <label>Enter OTP</label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) =>
                          setOtp(
                            e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 6),
                          )
                        }
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        required
                        style={{
                          letterSpacing: "0.5em",
                          textAlign: "center",
                          fontSize: "1.2em",
                        }}
                      />
                      <small
                        style={{
                          display: "block",
                          marginTop: "0.5rem",
                          color: "#666",
                        }}
                      >
                        OTP sent to {forgotEmail}
                      </small>
                    </div>

                    <button
                      type="submit"
                      className="loginButton"
                      disabled={otpVerifying}
                    >
                      {otpVerifying ? (
                        <>
                          <div className="spinner"></div>
                          Verifying...
                        </>
                      ) : (
                        "Verify OTP"
                      )}
                    </button>

                    <div
                      style={{
                        marginTop: "1rem",
                        textAlign: "center",
                      }}
                    >
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={resendCooldown > 0}
                        className="link"
                        style={{
                          background: "none",
                          border: "none",
                          cursor:
                            resendCooldown > 0
                              ? "not-allowed"
                              : "pointer",
                          opacity: resendCooldown > 0 ? 0.5 : 1,
                        }}
                      >
                        {resendCooldown > 0
                          ? `Resend OTP in ${resendCooldown}s`
                          : "Resend OTP"}
                      </button>
                    </div>
                  </form>
                )}

                {forgotPasswordStep === "reset" && (
                  <form onSubmit={handleResetPassword}>
                    <div className="inputGroup">
                      <label>New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) =>
                          setNewPassword(e.target.value)
                        }
                        placeholder="Enter new password (min 6 characters)"
                        required
                      />
                    </div>

                    <div className="inputGroup">
                      <label>Confirm Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(e.target.value)
                        }
                        placeholder="Confirm new password"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="loginButton"
                    >
                      Reset Password
                    </button>
                  </form>
                )}

                <div
                  className="signupRedirect"
                  style={{ marginTop: "1.5rem" }}
                >
                  <p>
                    Remember your password?{" "}
                    <button
                      onClick={handleCloseForgotPassword}
                      className="link"
                    >
                      Back to Login
                    </button>
                  </p>
                </div>

                <div className="securityFooter">
                  <p>Secured by Dynasty Premium</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}