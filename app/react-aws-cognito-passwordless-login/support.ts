export const generatePassword = () => {
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?";

  let allChars = lowercaseChars;
  allChars += uppercaseChars;
  allChars += numberChars;
  allChars += symbolChars;

  let password = "";
  for (let i = 0; i < 20; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars.charAt(randomIndex);
  }

  return password;
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  return emailRegex.test(email);
};
