"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
// import { createAccount, signInUser } from "@/lib/actions/user.actions";
// import OtpModal from "./OtpModal";

type Props = {
  type: "sign-in" | "sign-up";
};

const authFormSchema = (formType: "sign-in" | "sign-up") => {
  return z.object({
    email: z.string().email(),
    fullName:
      formType === "sign-up"
        ? z.string().min(2).max(50)
        : z.string().optional(),
  });
};

const AuthForm = ({ type }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState<null | string>(null);

  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setErrorMessage("");

    try {
      //   const user =
      //     type === "sign-up"
      //       ? await createAccount({
      //           fullName: values.fullName || "",
      //           email: values.email,
      //         })
      //       : await signInUser({ email: values.email });
      //   setAccountId(user.accountId);
    } catch {
      setErrorMessage(
        "Erreur dans la création de compte. Veuillez ressayer dans quelques minutes."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-8 flex flex-col gap-4"
        >
          <h1 className="text-3xl font-semibold">
            {type === "sign-in" ? "Sign-In" : "Sign-Up"}
          </h1>
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="text-md">Fullname</FormLabel>
                    <FormControl>
                      <Input
                        className="input-field"
                        placeholder="Enter your fullname"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="text-md">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="input-field"
                      placeholder="Entrer votre email"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          <Button
            className="bg-blue-700 hover:bg-blue-800 active:bg-blue-900 py-2 rounded-xl h-[60px]"
            type="submit"
            disabled={isLoading}
          >
            {type === "sign-in" ? "Se Connecter" : "S'Inscrire"}

            {isLoading && (
              <Image
                src={"/assets/icons/loader.svg"}
                width={24}
                height={24}
                alt="loader"
                className="ml-2 animate-spin"
              />
            )}
          </Button>

          {errorMessage && <p className="error-message">*{errorMessage}</p>}

          <div className="body-2 flex justify-center">
            <p className="text-light-100">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already registered?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="ml-1 font-semibold text-blue-800"
            >
              {type === "sign-in" ? "Sing-up" : "Sign-in"}
            </Link>
          </div>
        </form>
      </Form>

      {/* {accountId && (
        <OtpModal email={form.getValues("email")} accountId={accountId} />
      )} */}
    </>
  );
};

export default AuthForm;
