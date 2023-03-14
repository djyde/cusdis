import { tv } from "tailwind-variants";
export const styles = {
  container: tv({
    base: 'mx-auto p-8 sm:p-0 sm:pt-48',
    variants: {
      size: {
        'sm': 'md:w-[480px]',
        'md': 'md:w-[960px]'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  })
}