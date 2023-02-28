import { KeyboardEvent } from 'react'

export const onInputEnter = (callback: () => void) => {
  return (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') callback();
  }
}
