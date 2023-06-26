"use client";

import { MinusCircle, PlusCircle } from "lucide-react";
import { useCallback } from "react";

type Props = {
  title: string;
  subtitle: string;
  value: number;
  onChange: (value: number) => void;
  max?: number;
};

const Counter = ({ title, subtitle, value, onChange, max }: Props) => {
  const onAdd = useCallback(() => {
    if (value === max) {
      return;
    }
    onChange(value + 1);
  }, [max, onChange, value]);

  const onReduce = useCallback(() => {
    if (value === 1) {
      return;
    }
    onChange(value - 1);
  }, [onChange, value]);

  return (
    <div className="flexrow flex items-center justify-between">
      <div className="flex flex-col">
        <div className="font-medium">{title}</div>
        <div className="font-light text-gray-600">{subtitle}</div>
      </div>
      <div className="flex flex-row items-center gap-4">
        <div
          onClick={onReduce}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-[1px] border-neutral-400 text-neutral-600 transition hover:opacity-80"
        >
          <MinusCircle />
        </div>
        <div className="text-xl font-light text-neutral-600">{value}</div>
        <div
          onClick={onAdd}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-[1px] border-neutral-400 text-neutral-600 transition hover:opacity-80"
        >
          <PlusCircle />
        </div>
      </div>
    </div>
  );
};

export default Counter;
