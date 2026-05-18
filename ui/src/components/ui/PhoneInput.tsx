'use client'

import { forwardRef, useEffect, useMemo, useRef, useState, type ChangeEvent, type InputHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'
import {
  DEFAULT_PHONE_COUNTRY, PHONE_COUNTRIES,
  formatPhoneForStorage, getCountryFlag, splitPhoneNumber,
  type PhoneCountry,
} from '../../lib/phone-countries'

export interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'maxLength'> {
  label?: string
  error?: string
  helperText?: string
  defaultCountryIso?: string
  onCountryChange?: (country: PhoneCountry) => void
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(({
  className, label, error, helperText, id, onChange, onCountryChange,
  value, defaultCountryIso = 'IN', placeholder, ...props
}, ref) => {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s/g, '-') : undefined)
  const defaultCountry = PHONE_COUNTRIES.find((c) => c.iso2 === defaultCountryIso) ?? DEFAULT_PHONE_COUNTRY
  const pickerRef = useRef<HTMLDivElement>(null)

  const countryOptions = useMemo(() =>
    PHONE_COUNTRIES.map((country, i) => ({ key: `${country.iso2}-${country.dialCode}-${i}`, country })),
  [])
  const indiaOption = countryOptions.find((o) => o.country.iso2 === 'IN' && o.country.dialCode === '+91')
  const rest = countryOptions.filter((o) => !(o.country.iso2 === 'IN' && o.country.dialCode === '+91'))

  const [selectedCountry, setSelectedCountry] = useState(defaultCountry)
  const [pickerOpen, setPickerOpen] = useState(false)
  const { nationalNumber } = splitPhoneNumber(String(value ?? ''))

  useEffect(() => {
    const current = String(value ?? '').trim()
    if (!current.startsWith('+')) return
    setSelectedCountry(splitPhoneNumber(current).country)
  }, [value])

  useEffect(() => {
    if (!pickerOpen) return
    const handler = (e: MouseEvent) => {
      if (!pickerRef.current?.contains(e.target as Node)) setPickerOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [pickerOpen])

  const maxLen = Math.min(
    Math.max(...(selectedCountry.nationalNumberLengths ?? [14])),
    15 - selectedCountry.dialCode.replace(/\D/g, '').length,
  )
  const triggerW = selectedCountry.dialCode.replace(/\D/g, '').length >= 3 ? 'w-[7rem]' : 'w-[6.25rem]'

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, maxLen)
    onChange?.({ ...e, target: { ...e.target, value: formatPhoneForStorage(digits, selectedCountry) } } as ChangeEvent<HTMLInputElement>)
  }

  const handleCountryChange = (next: PhoneCountry) => {
    const nextMax = Math.min(Math.max(...(next.nationalNumberLengths ?? [14])), 15 - next.dialCode.replace(/\D/g, '').length)
    const nextNum = nationalNumber.slice(0, nextMax)
    setSelectedCountry(next)
    setPickerOpen(false)
    onCountryChange?.(next)
    onChange?.({ target: { value: nextNum ? formatPhoneForStorage(nextNum, next) : '' } } as ChangeEvent<HTMLInputElement>)
  }

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className={cn('block text-subhead font-medium mb-2', error ? 'text-red-500' : 'text-label-primary')}>
          {label}
        </label>
      )}
      <div className={cn('flex', error && 'ring-2 ring-red-500/20 rounded-xl')}>
        {/* Country picker */}
        <div ref={pickerRef} className={cn('relative flex items-center border border-r-0 rounded-l-xl bg-surface-secondary', error ? 'border-red-300' : 'border-separator-opaque')}>
          <button
            type="button"
            aria-label="Country calling code"
            aria-haspopup="listbox"
            aria-expanded={pickerOpen}
            onClick={() => setPickerOpen((v) => !v)}
            className={cn('h-full rounded-l-xl bg-transparent pl-2.5 pr-7 text-subhead font-medium outline-none cursor-pointer flex items-center gap-2', triggerW, 'focus:ring-2 focus:ring-primary/20')}
          >
            <FlagIcon country={selectedCountry} />
            <span className="min-w-0 truncate text-label-primary">{selectedCountry.dialCode}</span>
          </button>
          <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-label-tertiary" strokeWidth={2} />

          {pickerOpen && (
            <div role="listbox" className="absolute left-0 top-full z-50 mt-1 w-72 max-h-72 overflow-y-auto rounded-xl border border-separator-opaque bg-white shadow-lg py-1 text-sm">
              {indiaOption && (
                <CountryOption key={indiaOption.key} optionKey={indiaOption.key} country={indiaOption.country} selected={indiaOption.country.iso2 === selectedCountry.iso2} onSelect={handleCountryChange} className="border-b border-separator-opaque" />
              )}
              {rest.map(({ key, country }) => (
                <CountryOption key={key} optionKey={key} country={country}
                  selected={country.iso2 === selectedCountry.iso2 && country.dialCode === selectedCountry.dialCode}
                  onSelect={handleCountryChange} />
              ))}
            </div>
          )}
        </div>

        {/* Number input */}
        <input
          ref={ref}
          type="tel"
          id={inputId}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={maxLen}
          value={nationalNumber}
          onChange={handleChange}
          placeholder={placeholder ?? (selectedCountry.iso2 === 'IN' ? '98765 43210' : 'Phone number')}
          className={cn('input-base rounded-l-none flex-1 min-w-0', error && 'input-base-error', className)}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-footnote text-red-500">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-footnote text-label-secondary">{helperText}</p>}
    </div>
  )
})
PhoneInput.displayName = 'PhoneInput'

function FlagIcon({ country }: { country: PhoneCountry }) {
  return (
    <span className="relative inline-flex h-4 w-6 shrink-0 overflow-hidden rounded-[2px] bg-surface-secondary ring-1 ring-black/10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://flagcdn.com/w40/${country.iso2.toLowerCase()}.png`}
        alt={`${country.name} flag`}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = 'none'
          const fb = e.currentTarget.nextElementSibling as HTMLElement | null
          if (fb) fb.style.display = 'flex'
        }}
      />
      <span className="hidden h-full w-full items-center justify-center text-[10px] leading-none">
        {getCountryFlag(country.iso2)}
      </span>
    </span>
  )
}

function CountryOption({ optionKey, country, selected, onSelect, className }: {
  optionKey: string; country: PhoneCountry; selected: boolean
  onSelect: (c: PhoneCountry) => void; className?: string
}) {
  return (
    <button
      key={optionKey}
      type="button"
      role="option"
      aria-selected={selected}
      onClick={() => onSelect(country)}
      className={cn(
        'w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-surface-secondary focus:bg-surface-secondary focus:outline-none',
        selected && 'bg-primary/5 text-primary',
        className,
      )}
    >
      <FlagIcon country={country} />
      <span className="w-14 shrink-0 font-medium text-sm">{country.dialCode}</span>
      <span className="min-w-0 truncate text-sm text-label-secondary">{country.name}</span>
    </button>
  )
}

export { PhoneInput }
export type { PhoneCountry }
