import { useState } from "react";

const useDisclosure = (state: boolean) => {
  const [isOpen, setIsOpen] = useState(state);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(!isOpen);

  return { isOpen, open, close, toggle };
};

const useDisclosureMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const close = () => {
    setAnchorEl(null);
  };

  return { anchorEl, open, close };
};

export { useDisclosure, useDisclosureMenu };
