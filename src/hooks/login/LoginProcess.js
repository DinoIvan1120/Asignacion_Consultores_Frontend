import { LoginUser } from "../../services/login/LoginService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/Authutils";

export function LoginProcess(
  setIsModalOpen,
  setErrorMessage,
  setShowModal,
  setIsLoading
) {
  const navigate = useNavigate();

  const { setAccessToken } = useAuth();

  const handleLogin = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await LoginUser(email, password);

      if (response && response.token) {
        setAccessToken(response.token);
      }

      navigate("/dashboard");
    } catch (error) {
      console.log("Errorrrr: ", error);
      setIsModalOpen(true);
      setShowModal(true);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return handleLogin;
}
