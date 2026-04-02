import { cn } from "@/lib/utils"; //cn usually “className merge / conditional” ke liye use hota hai

interface ContainerProps {
  children: React.ReactNode; //ye container ke andar jo bhi React elements ya text aayega, uska type
  className?: string; //optional prop, agar user extra CSS classes add karna chahe
}

export default function Container({ children, className }: ContainerProps) {
  //typeScript ko bata raha hai ki props ka type ContainerProps hai
  return (
    <div className={cn("container mx-auto px-4", className)}>{children}</div>
  );
}

//Effectively:
//Ye ek reusable responsive container component hai jisme tum easily extra classes add kar sakte ho.
