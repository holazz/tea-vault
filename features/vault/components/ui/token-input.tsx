'use client'

import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface TokenInputProps {
  value: string
  onChange: (value: string) => void
  onMaxClick: () => void
}

export function TokenInput({ value, onChange, onMaxClick }: TokenInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-' || e.key === 'e') {
      e.preventDefault()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value)) {
      onChange(value)
    }
  }

  return (
    <div className="relative flex items-center">
      <Image src="/tea.png" className="absolute left-2" width={24} height={24} alt="Tea" />
      <Input
        type="number"
        placeholder="0"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="flex-1 pl-10 pr-16 focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <Button variant="secondary" size="xs" onClick={onMaxClick} className="absolute right-2">
        Max
      </Button>
    </div>
  )
}
