import { HTMLAttributes } from 'react';

export type Props = {
  slug: string
  children: React.ReactNode
  className?: string
  title?: string
  header?: React.ReactNode
  gutter?: boolean
  closeAreaSize?: 'default' | 'small'
}

export type TogglerProps = HTMLAttributes<HTMLButtonElement> & {
  slug: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
}
