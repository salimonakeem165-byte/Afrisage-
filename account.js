import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://hwepbiptkyyclolujwss.supabase.co";
const SUPABASE_KEY = "sb_publishable_r224RF354eCJGM0qs_bJ5g_t084YO8_";

const db = createClient(SUPABASE_URL, SUPABASE_KEY);

const signupForm = document.getElementById("signup");
const loginForm = document.getElementById("login");

const signupMsg = document.getElementById("signupMsg");
const loginMsg = document.getElementById("loginMsg");

function message(element, text, type = "") {
  element.textContent = text;
  element.className = "status " + type;
}

function getCheckedValues(name) {
  return [...document.querySelectorAll(
    `input[name="${name}"]:checked`
  )].map(input => input.value);
}

function setLoading(button, loading, text) {
  if (loading) {
    button.dataset.originalText = button.textContent;
    button.disabled = true;
    button.textContent = text;
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText || text;
  }
}

// Show author details when author account is selected.

const accountType = document.getElementById("accountType");
const authorDetails = document.getElementById("authorDetails");

accountType.addEventListener("change", () => {
  const isAuthor = ["author", "reader_author"].includes(
    accountType.value
  );

  authorDetails.classList.toggle("hidden", !isAuthor);

  document.getElementById("penName").required = isAuthor;
  document.getElementById("authorBio").required = isAuthor;
});

// ACCOUNT REGISTRATION

signupForm.addEventListener("submit", async event => {
  event.preventDefault();

  message(signupMsg, "");

  const form = new FormData(signupForm);

  const fullName = form.get("full_name").trim();
  const email = form.get("email").trim().toLowerCase();
  const password = form.get("password");
  const confirmPassword = form.get("confirm_password");
  const type = form.get("account_type");

  if (password.length < 8) {
    message(signupMsg, "Password must contain at least 8 characters.", "error");
    return;
  }

  if (password !== confirmPassword) {
    message(signupMsg, "Your passwords do not match.", "error");
    return;
  }

  if (!type) {
    message(signupMsg, "Please select your account type.", "error");
    return;
  }

  if (getCheckedValues("reasons").length === 0) {
    message(signupMsg, "Please select at least one reason for joining AfriSage.", "error");
    return;
  }

  const button = signupForm.querySelector('button[type="submit"]');
  setLoading(button, true, "Creating account...");

  const metadata = {
    full_name: fullName,
    date_of_birth: form.get("date_of_birth") || null,
    account_type: type,
    country: form.get("country").trim(),
    state: form.get("state").trim(),
    city: form.get("city").trim(),
    phone: form.get("phone").trim(),
    pen_name: form.get("pen_name").trim(),
    author_bio: form.get("author_bio").trim(),
    reasons: getCheckedValues("reasons"),
    genres: getCheckedValues("genres"),
    preferred_language: form.get("preferred_language"),
    discovery_source: form.get("discovery_source"),
    member_goal: form.get("member_goal").trim()
  };

  try {
    const { data, error } = await db.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: window.location.origin +
          window.location.pathname.replace(/[^/]*$/, "account.html")
      }
    });

    if (error) throw error;

    if (data.session) {
      message(
        signupMsg,
        "Your AfriSage account has been created. You are now signed in.",
        "success"
      );

      HTMLFormElement.prototype.reset.call(signupForm);
      authorDetails.classList.add("hidden");

      setTimeout(() => {
        window.location.href =
          type === "author" || type === "reader_author"
            ? "authors.html"
            : "books.html";
      }, 1500);

    } else {
      message(
        signupMsg,
        "Registration successful! Please check your email and click the confirmation link before logging in.",
        "success"
      );
    }

  } catch (error) {
    console.error(error);
    message(signupMsg, error.message || "Registration failed. Please try again.", "error");

  } finally {
    setLoading(button, false, "Create account");
  }
});

// ACCOUNT LOGIN

loginForm.addEventListener("submit", async event => {
  event.preventDefault();

  message(loginMsg, "");

  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;

  const button = loginForm.querySelector('button[type="submit"]');
  setLoading(button, true, "Signing in...");

  try {
    const { data, error } = await db.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    const user = data.user;

    message(loginMsg, "Login successful! Welcome to AfriSage.", "success");

    document.getElementById("accountBox").classList.remove("hidden");
    document.getElementById("accountText").textContent =
      "Signed in as " + user.email;

    const type = user.user_metadata?.account_type;

    setTimeout(() => {
      if (type === "author" || type === "reader_author") {
        window.location.href = "authors.html";
      } else {
        window.location.href = "books.html";
      }
    }, 1200);

  } catch (error) {
    console.error(error);
    message(loginMsg, error.message || "Login failed. Check your email and password.", "error");

  } finally {
    setLoading(button, false, "Log in");
  }
});

// PASSWORD RESET

document.getElementById("passwordReset").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();

  if (!email) {
    message(loginMsg, "Enter your email address first.", "error");
    return;
  }

  try {
    const { error } = await db.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin +
        window.location.pathname.replace(/[^/]*$/, "account.html")
    });

    if (error) throw error;

    message(loginMsg, "Password reset instructions have been sent to your email.", "success");

  } catch (error) {
    message(loginMsg, error.message, "error");
  }
});

// LOGOUT

document.getElementById("logout").addEventListener("click", async () => {
  const { error } = await db.auth.signOut();

  if (error) {
    message(loginMsg, error.message, "error");
    return;
  }

  window.location.reload();
});

// CHECK EXISTING LOGIN

async function checkAccount() {
  const { data, error } = await db.auth.getSession();

  if (error) {
    console.error(error);
    return;
  }

  if (data.session) {
    const user = data.session.user;

    document.getElementById("accountBox").classList.remove("hidden");
    document.getElementById("accountText").textContent =
      "Signed in as " + user.email;
  }
}

checkAccount();
