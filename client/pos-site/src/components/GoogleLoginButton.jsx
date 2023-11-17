import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import url from "../../constants";
import { toast } from "react-toastify";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="">
        <GoogleOAuthProvider clientId="43222171383-jlkm5o9dh4gnpbkehv1lmk7opj0oa48i.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                // console.log(credentialResponse.credential);
                const { data } = await axios.post(
                  url + "/auth/google/callback",
                  {
                    code: credentialResponse.credential,
                  }
                );
                // console.log(data, '<<< credentials');

                localStorage.setItem("access_token", data);
                navigate("/");
              } catch (error) {
                console.error("Login failed:", error.message);
                toast.error(error.message, {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
              }
            }}
            onError={() => {
              console.log("Login Failed");
            }}
            useOneTap
          />
        </GoogleOAuthProvider>
      </div>
    </>
  );
};

export default GoogleLoginButton;