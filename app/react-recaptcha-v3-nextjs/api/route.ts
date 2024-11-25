const validateRecaptcha = async (token: string) => {
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RE_CAPTCHA_SECRET_KEY}&response=${token}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json();
};

export async function POST(req: Request) {
  const { code } = await req.json();

  const response = await validateRecaptcha(code);

  return Response.json(response);
}
