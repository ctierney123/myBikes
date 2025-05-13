import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithEmailAndPassword,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  GithubAuthProvider,
  AuthErrorCodes,
  updateEmail,
} from "firebase/auth";

function handleError(errorMessage) {
  if (errorMessage.includes(AuthErrorCodes.INVALID_LOGIN_CREDENTIALS)) {
    return "Incorrect email or password";
  } else if (
    errorMessage.includes(AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER)
  ) {
    return "Too many attempts try again later or reset password";
  } else if (errorMessage.includes(AuthErrorCodes.INVALID_EMAIL)) {
    return "Invalid email address";
  } else {
    return errorMessage;
  }
}

async function doCreateUserWithEmailAndPassword(email, password, displayName) {
  const auth = getAuth();
  await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(auth.currentUser, { displayName: displayName });
}

async function doChangePassword(email, oldPassword, newPassword) {
  const auth = getAuth();
  let credential = EmailAuthProvider.credential(email, oldPassword);
  console.log(credential);
  await reauthenticateWithCredential(auth.currentUser, credential);

  await updatePassword(auth.currentUser, newPassword);
  await doSignOut();
}

async function doSignInWithEmailAndPassword(email, password) {
  let auth = getAuth();
  await signInWithEmailAndPassword(auth, email, password);
}

async function doSocialSignIn(provider) {
  let auth = getAuth();

  let socialProvider = null;
  if (provider === "google") {
    socialProvider = new GoogleAuthProvider();
  } else if (provider === "github") {
    socialProvider = new GithubAuthProvider();
  }

  await signInWithPopup(auth, socialProvider);
}

async function doPasswordReset(email) {
  let auth = getAuth();
  await sendPasswordResetEmail(auth, email);
}

async function doSignOut() {
  let auth = getAuth();
  await signOut(auth);
}

async function updateUsername(username) {
  const auth = getAuth();
  await updateProfile(auth.currentUser, { displayName: username });
}

async function updateEmailAddress(email) {
  const auth = getAuth();
  await updateEmail(auth.currentUser, email);
}

export {
  doCreateUserWithEmailAndPassword,
  doSocialSignIn,
  doSignInWithEmailAndPassword,
  doPasswordReset,
  doSignOut,
  doChangePassword,
  handleError,
  updateEmailAddress,
  updateUsername,
};
