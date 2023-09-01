"use client";

import { useMemo } from "react";

import { uuid } from "@/utils/uuid";

import Styles from "./Selector.module.scss";

type props<T extends string> = {
  value: T;
  options: { value: T; label: string; disabled?: boolean }[];
  onChange: (input: T) => void;
};

const Selector = <T extends string>({ value, options, onChange }: props<T>) => {
  const id = useMemo(uuid, []);
  return (
    <div className={Styles.wrapper}>
      {options.map((option) => {
        return (
          <label
            key={option.value}
            className={`${Styles.label} ${
              value === option.value && Styles.checked
            }`}
          >
            <input
              className={Styles.input}
              type="radio"
              name={id}
              value={option.value}
              checked={value === option.value}
              disabled={!!option.disabled}
              onChange={() => onChange(option.value)}
            />
            <span className={Styles.span}>{option.label}</span>
          </label>
        );
      })}
    </div>
  );
};

export { Selector };
