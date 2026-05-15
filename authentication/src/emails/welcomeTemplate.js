export const welcomeTemplate =(name)=>{
    return`
        <div
  style="
    background:#f4f4f4;
    padding:40px 20px;
    font-family:Arial,sans-serif;
  "
>

  <div
    style="
      max-width:600px;
      margin:auto;
      background:white;
      border-radius:12px;
      overflow:hidden;
      box-shadow:0 2px 10px rgba(0,0,0,0.1);
    "
  >

    <!-- Header -->
    <div
      style="
        background:#111827;
        padding:30px;
        text-align:center;
      "
    >
      <h1
        style="
          color:white;
          margin:0;
          font-size:28px;
        "
      >
        Welcome 🎉
      </h1>
    </div>

    <!-- Body -->
    <div style="padding:40px">

      <h2
        style="
          color:#111827;
          margin-bottom:20px;
        "
      >
        Hello ${name},
      </h2>

      <p
        style="
          color:#4b5563;
          line-height:1.8;
          font-size:16px;
        "
      >
        Thank you for registering an account with us.
        We're excited to have you onboard.
      </p>

      <p
        style="
          color:#4b5563;
          line-height:1.8;
          font-size:16px;
        "
      >
        Your account has been successfully created and
        you can now enjoy all the features available on
        our platform.
      </p>

      <!-- Button -->
      <div style="margin-top:30px">

        <a
          href="https://ajfdata.vercel.app/Login"
          style="
            background:#111827;
            color:white;
            padding:14px 24px;
            text-decoration:none;
            border-radius:8px;
            display:inline-block;
            font-size:16px;
          "
        >
          Get Started
        </a>

      </div>

      <!-- Footer -->
      <div
        style="
          margin-top:50px;
          border-top:1px solid #e5e7eb;
          padding-top:20px;
        "
      >

        <p
          style="
            color:#9ca3af;
            font-size:14px;
            line-height:1.6;
          "
        >
          If you did not create this account,
          please ignore this email.
        </p>

      </div>

    </div>

  </div>

</div>
      
    `
}