import type { ReactNode } from "react";

type IconProps = {
  className?: string | undefined;
  size?: number;
};

const SvgIcon = ({ children, className, size = 18 }: IconProps & { children: ReactNode }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    height={size}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width={size}
  >
    {children}
  </svg>
);

export const ArrowRightIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </SvgIcon>
);

export const EyeIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </SvgIcon>
);

export const EyeOffIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <path d="m3 3 18 18" />
    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
    <path d="M9.9 5.2A9.3 9.3 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-2.1 3.1" />
    <path d="M6.6 6.6C3.7 8.5 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4-.9" />
  </SvgIcon>
);

export const HeartIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
  </SvgIcon>
);

export const LockIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <rect height="11" rx="2" width="16" x="4" y="11" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </SvgIcon>
);

export const MailIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <rect height="16" rx="2" width="20" x="2" y="4" />
    <path d="m22 7-10 6L2 7" />
  </SvgIcon>
);

export const PawIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <circle cx="7.5" cy="8" r="2.2" />
    <circle cx="16.5" cy="8" r="2.2" />
    <circle cx="10" cy="4.5" r="2" />
    <circle cx="14" cy="4.5" r="2" />
    <path d="M7.8 16.7c0-3 2-5.2 4.2-5.2s4.2 2.2 4.2 5.2c0 2-1.4 3.3-3.1 2.5a2.7 2.7 0 0 0-2.2 0c-1.7.8-3.1-.5-3.1-2.5Z" />
  </SvgIcon>
);

export const UserIcon = (props: IconProps) => (
  <SvgIcon {...props}>
    <path d="M20 21a8 8 0 0 0-16 0" />
    <circle cx="12" cy="7" r="4" />
  </SvgIcon>
);
