"use client";

import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { Textarea } from '@/components/ui/textarea';

const page = () => {

  const form = useRef();
  const [btnTxt, setBtnTxt] = useState('Send');

  const formSchema = z.object({
    username: z.string().min(2).max(50),
    email: z.string().min(2).max(50),
    message: z.string().min(2).max(200),
  })

  const Formm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      message: ""
    },
  })

  function sendMail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    emailjs
      .sendForm(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '', process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '', form.current || '', {
        publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      })
      .then(
        () => {
          setBtnTxt('Sent!');
          console.log('SUCCESS!');
        },
        (error) => {
          setBtnTxt('Failed!');
          console.log('FAILED...', error.text);
        },
      );
  }

  return (
    <>
      <h1 className='head-text mb-10'>
        Contact Us
      </h1>

      <section className="mt-10 flex flex-col gap-5">
        <Form {...Formm}>
          <form
            // onSubmit={form.handleSubmit(() => onSubmit)}
            onSubmit={(e) => sendMail(e)}
            // onSubmit={sendEmail}
            className="flex flex-col justify-start gap-3"
            ref={form}
          >
            <FormField
              control={Formm.control}
              name="username"
              render={({ field }) => (
                <FormItem className='flex flex-col gap-3 w-full'>
                  {/* username */}
                  <FormLabel className='mt-3 text-base-semibold text-light-2'>
                    Username
                  </FormLabel>
                  <FormControl
                    className='no-focus border border-dark-4 bg-dark-3 text-light-1'
                  >
                    <Input
                      placeholder="username"
                      {...field}
                      name='user_name'
                      type='text'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={Formm.control}
              name="email"
              render={({ field }) => (
                <FormItem className='flex flex-col gap-3 w-full'>
                  {/* email */}
                  <FormLabel className='mt-3 text-base-semibold text-light-2'>
                    Email
                  </FormLabel>
                  <FormControl
                    className='no-focus border border-dark-4 bg-dark-3 text-light-1'
                  >
                    <Input
                      placeholder="email@vitroubles.com"
                      {...field}
                      name='user_email'
                      type='email'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={Formm.control}
              name="message"
              render={({ field }) => (
                <FormItem className='flex flex-col gap-3 w-full'>
                  {/* message */}
                  <FormLabel className='mt-3 text-base-semibold text-light-2'>
                    Message
                  </FormLabel>
                  <FormControl
                    className='no-focus border border-dark-4 bg-dark-3 text-light-1'
                  >
                    <Textarea
                      rows={15}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" value='Send' className='bg-primary-500'>{btnTxt}</Button>
          </form>
        </Form>
      </section>
    </>
  );
};

export default page;