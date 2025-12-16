import { Button } from "primereact/button";
import Image from "next/image";

interface HeaderLogoProps {
  onToggleSidebar: () => void;
}

export const HeaderLogo = ({ onToggleSidebar }: HeaderLogoProps) => {
  return (
    <div className="flex gap-2 md:gap-4 align-items-center">
      <Button
        onClick={onToggleSidebar}
        className="block md:hidden text-800 text-xl"
        icon="pi pi-bars"
        text
      />

      <div className="surface-50 p-2 border-round-lg flex align-items-center">
        <Image
          src="/img/logo.png"
          alt="HR Marstech Logo"
          className="w-2rem md:w-3rem h-auto"
          width={48}
          height={48}
        />
      </div>

      <h1 className="text-sm md:text-lg font-bold text-800 my-0">
        HR Marstech
      </h1>
    </div>
  );
};
