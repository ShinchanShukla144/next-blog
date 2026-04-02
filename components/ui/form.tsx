"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  type ControllerProps,
  type FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";

export const Form = FormProvider;

export function FormField<TFieldValues extends FieldValues>(
  props: ControllerProps<TFieldValues>,
) {
  return <Controller {...props} />;
}

export function FormItem({ ...props }) {
  return <div {...props} />;
}

export function FormLabel({ ...props }) {
  return <LabelPrimitive.Root {...props} />;
}

export function FormControl({ ...props }) {
  return <Slot {...props} />;
}

export function FormMessage() {
  const { formState } = useFormContext();
  return formState.errors ? (
    <p className="text-sm text-red-500">Error</p>
  ) : null;
}
