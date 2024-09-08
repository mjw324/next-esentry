import { twMerge } from "tailwind-merge";
import { clsx, ClassValue } from "clsx";

const cn = (...input: ClassValue[]) => twMerge(clsx(input));

export default cn;
