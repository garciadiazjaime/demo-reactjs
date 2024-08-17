export const MESSAGE_LENGTH = 240;
export const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const isDataValid = (email: string, message: string) => {
  return EMAIL_REGEX.test(email) && message.length <= MESSAGE_LENGTH;
};

function sanitize(string: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };
  const reg = /[&<>"'/]/gi;
  return string.replace(reg, (match) => map[match]);
}

export const emailService = async (
  email: string,
  message: string
): Promise<void> => {
  if (!isDataValid(email, message)) {
    return Promise.reject("DATA_INVALID");
  }

  await fetch(
    `${process.env.NEXT_PUBLIC_BASE_PATH}/.netlify/functions/send-form`,
    {
      method: "POST",
      body: JSON.stringify({
        email: sanitize(email),
        message: sanitize(message),
      }),
    }
  );
};
