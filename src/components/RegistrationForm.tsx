import axios from '../api/axios';
import { useNavigate } from "react-router-dom";
import { useEffect, useReducer } from 'react';
import { User } from '../models/user';

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

const registrationFormSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
  confirmPassword: z.string().min(2).max(50),
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match!",
      path: ['confirmPassword']
    });
  }
});

const registrationReducer = (state, action) => {
  switch (action.type) {
    case "REGISTRATION_INIT": 
      return { response: null, isLoading: true, isError: false }
    case "REGISTRATION_SUCCESS": 
      return { response: action.payload, isLoading: false, isError: false }
    case "REGISTRATION_FAILURE":
      return { response: action.payload, isLoading: false, isError: true }
    default: 
      throw new Error();
  }
}

const RegistrationForm = ({user}: {user: User|null}) => {
	const navigate = useNavigate();
  // redirect to index/home page if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [])

  const [registration, dispatchRegistration] = useReducer(
    registrationReducer,
    { response: null, isLoading: false, isError: false }
  );

  // define form
  const registrationForm = useForm<z.infer<typeof registrationFormSchema>>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  })

  const handleRegistrationSubmit = (values: z.infer<typeof registrationFormSchema>) => {
    const body = {
      username: values.username,
      password: values.password
    };
    
    dispatchRegistration({ type: "REGISTRATION_INIT" })

    setTimeout(async () => { // timeout for fun to play around with loading
      try {
        const response = await axios.post("/auth/register", body);
        
        console.log(response);
        dispatchRegistration({
          type: "REGISTRATION_SUCCESS",
          payload: {
            message: "Registration Success",
            description: "We will now redirect you to the login page."
          }
        });

        // redirect to login page if registration successful
        setTimeout(() => navigate("/login"), 2000);
      } catch (error) {
        console.log(error);

        dispatchRegistration({
          type: "REGISTRATION_FAILURE",
          payload: {
            message: error.response?.data ?? error.message,
            description: "Please try again."
          }
        });
      }
    }, 1000)
  }

  return (
    <div className="flex flex-col gap-3">
      
      {registration.response &&
        <RegistrationStatusMessage registration={registration} />
      }

      <h1 className="text-xl font-medium text-center">Registration</h1>

      <Form {...registrationForm}>
        <form onSubmit={registrationForm.handleSubmit(handleRegistrationSubmit)} className="space-y-2">
          <FormField
            control={registrationForm.control}
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
            control={registrationForm.control}
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

          <FormField
            control={registrationForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-center">
            <Button type="submit" disabled={registration.isLoading}>
              {registration.isLoading &&
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              }
              Register
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default RegistrationForm

const RegistrationStatusMessage = ({ registration }) => {
  return (
    <Alert variant={registration.isError ? "destructive" : "success"}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{registration.response.message}</AlertTitle>
      <AlertDescription>{registration.response.description}</AlertDescription>
    </Alert>
	)
}