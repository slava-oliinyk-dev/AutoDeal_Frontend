import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail, validateEnglishName, validatePassword } from "../../utils/validation";
import { loginUser, registerUser, extractAuthToken, extractAuthRole, AuthApiError } from "../api/auth.api";
import { setAuthToken } from "../../utils/auth";
import styles from "./AuthLayout.module.scss";
import { Modal } from "../Ui/Modal/Modal";

type AuthFormState = {
  name: string;
  email: string;
  password: string;
};

type AuthMode = "login" | "register";

const INITIAL_FORM: AuthFormState = {
  name: "",
  email: "",
  password: "",
};

const AuthLayout = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState<AuthFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof AuthFormState, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegister = mode === "register";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    const nextErrors: Partial<Record<keyof AuthFormState, string>> = {};

    const emailError = validateEmail(form.email);
    if (emailError) nextErrors.email = emailError;

    if (isRegister) {
      const nameError = validateEnglishName(form.name);
      if (nameError) nextErrors.name = nameError;

      const passwordError = validatePassword(form.password);
      if (passwordError) nextErrors.password = passwordError;
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) return;

    setIsSubmitting(true);

    try {
      const payload = { email: form.email, password: form.password, name: form.name };
      const response = isRegister ? await registerUser({ email: payload.email, password: payload.password, name: payload.name }) : await loginUser({ email: payload.email, password: payload.password });

      if (!isRegister) {
        const token = extractAuthToken(response) ?? "session";
        const role = extractAuthRole(response);
        setAuthToken(token, role);
      }

      setForm(INITIAL_FORM);
      setErrors({});

      if (isRegister) {
        setOpen(true);
      } else {
        navigate("/");
      }
    } catch (error) {
      if (mode === "login" && error instanceof AuthApiError && (error.status === 400 || error.status === 401)) {
        setSubmitError("Invalid email or password");
      } else {
        setSubmitError(error instanceof Error ? error.message : "Authentication failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.auth}>
      <div className={styles.container}>
        <h2 className={styles.title}>{isRegister ? "Create account" : "Sign in"}</h2>

        <form className={styles.inputs} onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <input
                className={styles.input}
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(event) => {
                  setSubmitError(null);
                  setErrors((prev) => ({ ...prev, name: undefined }));
                  setForm((prev) => ({ ...prev, name: event.target.value }));
                }}
              />
              {errors.name && <p className={styles.error}>{errors.name}</p>}
            </>
          )}

          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => {
              setSubmitError(null);
              setErrors((prev) => ({ ...prev, email: undefined }));
              setForm((prev) => ({ ...prev, email: event.target.value }));
            }}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}

          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => {
              setSubmitError(null);
              setErrors((prev) => ({ ...prev, password: undefined }));
              setForm((prev) => ({ ...prev, password: event.target.value }));
            }}
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}

          <button className={styles.button} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : isRegister ? "Sign up" : "Sign in"}
          </button>

          {submitError && <p className={styles.error}>{submitError}</p>}

          <p className={styles.switchText}>
            {isRegister ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className={styles.switchBtn}
                  onClick={() => {
                    setMode("login");
                    setForm(INITIAL_FORM);
                    setErrors({});
                    setSubmitError(null);
                    setOpen(false);
                  }}
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className={styles.switchBtn}
                  onClick={() => {
                    setMode("register");
                    setForm(INITIAL_FORM);
                    setErrors({});
                    setSubmitError(null);
                    setOpen(false);
                  }}
                >
                  Sign up
                </button>
              </>
            )}
          </p>
        </form>
      </div>
      <Modal open={open} onOpenChange={setOpen} title="Registration success">
        <div className={styles.modal}>
          <h2 className={styles.modalTitle}>Check your email</h2>
          <h3 className={styles.modalSubtitle}>We’ve sent a verification email to your inbox. Please confirm your email address to activate your account.</h3>
          <button type="button" onClick={() => setOpen(false)} className={styles.close}>
            Close
          </button>
        </div>
      </Modal>
    </section>
  );
};

export default AuthLayout;
