import { formatRut as formatRutLib, RutFormat } from '@fdograph/rut-utilities'

function formatRut(value?: string | null): string {
  if (!value) {
    return ''
  }

  return formatRutLib(value, RutFormat.DOTS_DASH)
}

export { formatRut }
