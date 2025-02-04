import { buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import * as React from "react";

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
  asChild?: boolean;
}

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface InputProps extends React.ComponentProps<"input"> {
  className?: string;
}
