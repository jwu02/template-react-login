import axios from '../api/axios';
import { useNavigate } from "react-router-dom";
import { useEffect, useReducer } from 'react';
import { USER_STORAGE_KEY, JWT_TOKEN_STORAGE_KEY } from '../constants';
import { getUserFromLocalStorage } from '../utilities';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
 
const loginFormSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
});

const loginReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_INIT": 
      return { message: null, isLoading: true, isError: false }
    case "LOGIN_SUCCESS": 
      return { message: action.payload, isLoading: false, isError: false }
    case "LOGIN_FAILURE":
      return { message: action.payload, isLoading: false, isError: true }
    default: 
      throw new Error();
  }
}

const LoginForm = ({user, setUser}) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      // redirect to index/home page if already logged in
      navigate("/");
    }
  }, []);
  
  const [login, dispatchLogin] = useReducer(
    loginReducer,
    { message: null, isLoading: false, isError: false }
  );

  // define form
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLoginSubmit = (values: z.infer<typeof loginFormSchema>) => {
    const body = {
      username: values.username,
      password: values.password
    };
    
    dispatchLogin({ type: "LOGIN_INIT" });
    
    setTimeout(async () => { // timeout for fun to show loading effect
      try {
        const response = await axios.post("/auth/login", body);
        
        console.log(response);
        // store bearer token and user details
        localStorage.setItem(JWT_TOKEN_STORAGE_KEY, response.data.jwt);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.data.user));
        setUser(getUserFromLocalStorage());
        navigate("/");
      } catch (error) {
        console.log(error);
        
        dispatchLogin({ 
          type: "LOGIN_FAILURE", 
          // ERR_NETWORK error doesn't have a server response data
          payload: error.response?.data ?? error.message 
        });
      }
    }, 1000);
  }

  return (
    <div className="flex flex-col gap-3">

      {login.message &&
        <LoginStatusMessage login={login} />
      }

      <h1 className="text-xl font-medium text-center">Login</h1>

      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-2">
          <FormField
            control={loginForm.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-center">
            <Button type="submit" disabled={login.isLoading}>
              {login.isLoading &&
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              }
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default LoginForm

const LoginStatusMessage = ({ login }) => {
  return (
    <Alert variant={login.isError && "destructive"}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{login.message}</AlertDescription>
    </Alert>
  )
}