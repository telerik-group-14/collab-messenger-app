import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../Ui/Button';
import InputSection from '../Ui/InputSection';
import { useAuth } from '../../hooks/useAuth';

export default function SignIn() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const { login } = useAuth();

  const signInHandler = async () => {
    try {
      await login(email, password);
      toast.success('Login successful');
      navigate('/');
    } catch (error) {
      console.error(error.message);
      toast.error('Authentication failed');
    }
  };

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-700">
      <div className="h-18">
        <div className="text-m font-bold text-white bg-slate-800 p-6">
          LogIn
        </div>
      </div>
      <div className="w-full px-6 py-4 overflow-hidden ">
        <div className="w-1/3">
          <form>
            <div className="mt-4">
              <InputSection
                onChange={emailChangeHandler}
                label="Email"
                type="email"
                placeholder="name@mail.com"
              />
            </div>
            <div className="mt-4">
              <InputSection
                onChange={passwordChangeHandler}
                label="Password"
                type="password"
              />
            </div>
            <Link to="#" className="text-xs text-gray-50 hover:underline">
              Forget Password?
            </Link>
            <div className="flex items-center mt-4">
              <Button title="Sign In" onClick={signInHandler} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
