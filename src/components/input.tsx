"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";

export default function ShadcnFloatingLabel() {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mt-4">
      <Label
        htmlFor="nombre-formulario"
        className={`absolute left-3 transition-all duration-200 cursor-text ${
          value || isFocused
            ? "top-[-10px] text-sm bg-background px-1 text-primary"
            : "top-3 text-muted-foreground"
        }`}
      >
        Nombre del formulario
      </Label>
      <Input
        id="nombre-formulario"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isFocused ? "Nombre del formulario" : ""}
        className="pt-4"
      />
    </div>
  );
}